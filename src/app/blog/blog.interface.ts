import { ObjectId } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  user: ObjectId;
  category?: string;
  tags?: string[];
  coverImage?: string;
  status: "draft" | "published" | "archived" | "scheduled";
  scheduledAt?: Date;
  views: number;
  likes: number;
  comments: {
    user: ObjectId;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
