import { Request, Response, NextFunction } from "express";
import promClient, { collectDefaultMetrics } from "prom-client";

collectDefaultMetrics();

const requestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "status"],
});

const responseDuration = new promClient.Histogram({
  name: "http_response_duration_seconds",
  help: "Histogram of HTTP response durations in seconds",
  labelNames: ["method", "status"],
  buckets: [0.1, 0.2, 0.5, 1, 2, 5],
});

export const prometheusMetricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const endTimer = responseDuration.startTimer();

  res.on("finish", () => {
    requestCounter.inc({ method: req.method, status: res.statusCode });

    endTimer({ method: req.method, status: res.statusCode });
  });

  next();
};

export const metricsEndpointMiddleware = async (req: Request, res: Response) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
};

export const metricsEndpointJsonMiddleware = async (req: Request, res: Response) => {
  const metricsText = await promClient.register.metrics();

  const metricsJson = convertMetricsToJSON(metricsText);

  res.json(metricsJson);
};

const convertMetricsToJSON = (metricsText: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricsJson: Record<string, any> = {};
  const lines = metricsText.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("#") || !line.trim()) {
      return;
    }

    const [metricName, metricValue] = line.split(" ");
    const labels = metricName.match(/{(.+)}/);

    if (labels) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const labelsObj: Record<string, any> = {};
      const labelPairs = labels[1].split(",").map((pair) => pair.split("="));
      labelPairs.forEach(([key, value]) => {
        labelsObj[key] = value.replace(/"/g, "");
      });

      if (!metricsJson[metricName]) {
        metricsJson[metricName] = [];
      }

      metricsJson[metricName].push({
        value: parseFloat(metricValue),
        labels: labelsObj,
      });
    } else {
      if (!metricsJson[metricName]) {
        metricsJson[metricName] = [];
      }

      metricsJson[metricName].push({
        value: parseFloat(metricValue),
        labels: {},
      });
    }
  });

  return metricsJson;
};
