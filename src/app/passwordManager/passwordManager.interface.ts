import { Model, ObjectId } from "mongoose";

export interface IPasswordManager extends Document {
  user: ObjectId;
  website: string;
  username: string;
  encryptedPassword: string;
  notes?: string;
  category?: string;
}

export type TPasswordManagerModel = Model<IPasswordManager, Record<string, unknown>>;
