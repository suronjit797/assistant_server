import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    coverImage: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "scheduled"],
      default: "draft",
    },
    scheduledAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },
  },
  {
    timestamps: true,
  },
);

// Index for search optimization
BlogSchema.index({ title: "text", content: "text" });

const BlogModel = model<IBlog>("Blog", BlogSchema);
export default BlogModel;
