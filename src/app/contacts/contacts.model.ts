import { model, Schema } from "mongoose";
import { IContact } from "./contacts.interface";

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    notes: { type: String, trim: true },
    tags: [String],
    others: [String],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Indexes for better search performance on email and tags
ContactSchema.index({ email: 1 });
ContactSchema.index({ tags: 1 });

const ContactModal = model<IContact>("Contact", ContactSchema);

export default ContactModal;
