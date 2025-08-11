import { ObjectId } from "mongoose";

export interface IDiary extends Document {
  user: ObjectId;
  title: string;
  date: Date;
  content: string;
  mood?: "happy" | "sad" | "angry" | "excited" | "neutral" | "anxious";
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  isPublic: boolean;
  shareableLink?: string;
  versionHistory: {
    content: string;
    updatedAt: Date;
  }[];
}
