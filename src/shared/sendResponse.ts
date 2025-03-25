import { Response } from "express";
import { IMeta } from "../global/globalInterfaces";

type TPayload<T> = {
  success: boolean;
  message: string;
  meta?: IMeta;
  data?: T;
};

const sendResponse = <T>(res: Response, status: number, payload: TPayload<T>) => {
  const { success, message, data, meta } = payload;

  const response: Partial<TPayload<T>> = { success, message };

  if (meta) {
    response.meta = meta;
  }

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(status).json(response);
};

export default sendResponse;
