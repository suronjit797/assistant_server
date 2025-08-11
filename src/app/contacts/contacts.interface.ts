import { Document, ObjectId } from "mongoose";

export interface IContact extends Document {
  user: ObjectId;
  name: string;
  email: string;
  phone?: string;
  others?: string[];
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags: string[];
}
