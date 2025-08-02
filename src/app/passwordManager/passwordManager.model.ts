import { Schema, model } from "mongoose";
import { IPasswordManager, TPasswordManagerModel } from "./passwordManager.interface";
import { passwordManagerTypes } from "../../shared/constant";

const transactionSchema = new Schema<IPasswordManager>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    website: { type: String, required: true },
    username: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    notes: { type: String },
    category: { type: String, enum: passwordManagerTypes, default: "other" },
  },
  { timestamps: true },
);

const PasswordManagerModel = model<IPasswordManager, TPasswordManagerModel>("PasswordManager", transactionSchema);

export default PasswordManagerModel;
