import cookieParser from "cookie-parser";
import cors from "cors";
// import csurf from "csurf";
import type { Application, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./app/routes";
import globalError from "./global/globalError.js";
import { metricsEndpointJsonMiddleware, prometheusMetricsMiddleware } from "./middleware/promMiddleware";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(prometheusMetricsMiddleware);

// can be more config for security
app.use(helmet());

// CSRF Protection for cookies
// app.use(csurf({ cookie: true }));
// route

app.get("/", async (req: Request, res: Response) => {
  res.send("<h1> Welcome to bun Manager </h1>");
});

app.get("/metrics", metricsEndpointJsonMiddleware);

// main api routes
app.use("/api/v1", router);
// handle not found route

app.use((req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "Route not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Route not found",
      },
    ],
  });
});

app.use(globalError);

export default app;
