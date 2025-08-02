import cookieParser from "cookie-parser";
import cors from "cors";
// import csurf from "csurf";
import type { Application, Request, Response } from "express";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import router from "./app/routes";
import config from "./config";
import { metricsEndpointJsonMiddleware, prometheusMetricsMiddleware } from "./middleware/promMiddleware";
import globalError from "./global/globalError";

const app: Application = express();
const buildPath = config.FRONTEND_BUILD_PATH;

// const allowedOrigins: any = ["http://localhost:3000", "http://199.250.210.184:5000", "http://localhost:5000"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"), false);
//       }
//     },
//   }),
// );

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(prometheusMetricsMiddleware);

// can be more config for security
// app.use(helmet());

// CSRF Protection for cookies
// app.use(csurf({ cookie: true }));
// route



app.get("/metrics", metricsEndpointJsonMiddleware);

// main api routes
app.use("/api/v1", router);
// handle not found route

// frontend
if (fs.existsSync(buildPath + "/index.html")) {
  console.log("Found ----------------> ", buildPath);
  app.use("/", express.static(path.resolve(buildPath)));
  app.use(function (req:Request, res:Response) {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
} else {
  console.log("Not found ----------------> ", buildPath);
  app.use("/", express.static("public"));
}

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
