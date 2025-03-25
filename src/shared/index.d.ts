import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../global/globalInterfaces";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | CustomJwtPayload;
      partialFilter: array
    }
  }
}
