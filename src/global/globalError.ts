/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ErrorRequestHandler } from "express";
import { MongoError } from "mongodb";
import { ZodError } from "zod";
import config from "../config";

export class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalError: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let status = "error";
  let message = "Something went wrong!";
  let errorMessages: { path: string; message: string }[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    status = "fail";
    message = "Validation error";
    errorMessages = err.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));
  } else if (err instanceof MongoError) {
    statusCode = 500;
    status = "error";
    message = "Database error";
    if (err.code === 11000) {
      message = "Duplicate key error";
      errorMessages = Object.keys((err as any).keyValue).map((key) => ({
        path: key,
        message: `Duplicate value for ${key}: ${(err as any).keyValue[key]}`,
      }));
    }
  } else {
    message = err.message || message;
  }

  const response = {
    success: false,
    status,
    message,
    errorMessages,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default globalError;
