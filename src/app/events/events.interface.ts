import { Document, ObjectId } from "mongoose";

export interface IEvent extends Document {
  user: ObjectId;
  startDate: Date;
  endDate?: Date;
  title: string;
  description?: string;
  location?: string;
  allDay: boolean;
  organizer?: {
    name: string;
    email?: string;
    phone?: string;
  };
  attendees: number;
  category?: string;
  tags: string[];
  isPublic: boolean;
  isOnline: boolean;
  onlineLink: string;
}
