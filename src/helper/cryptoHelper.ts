// utils/cryptoService.ts
import crypto from "crypto";
// import config from "../config";
import UserModel from "../app/user/user.model";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended for GCM
const KEY_LENGTH = 32; // 256-bit key
const PBKDF2_ITERATIONS = 100_000;

export const encrypt = async (plainText: string, userId: string) => {
  const { key, salt } = await generateFullEncryptionKey(userId);

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Final format: salt:iv:authTag:cipherText (all in hex)
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

export const decrypt = async (cipherText: string, userId: string) => {
  const [saltHex, ivHex, authTagHex, encryptedHex] = cipherText.split(":");
  if (!saltHex || !ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted data format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedHex, "hex");

  const user = await UserModel.findById(userId).select("secret");
  if (!user?.secret) throw new Error("User secret missing");

  const key = crypto.pbkdf2Sync(user.secret, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString("utf8");
};

const generateFullEncryptionKey = async (userId: string): Promise<{ key: Buffer; salt: Buffer }> => {
  const user = await UserModel.findById(userId).select("secret salt").lean();

  if (!user?.secret) throw new Error("User secret missing");

  if (!user?.salt) {
    // If salt is missing, generate and save it
    const newSalt = crypto.randomBytes(16);
    await UserModel.findByIdAndUpdate(userId, { salt: newSalt.toString("hex") });
    user.salt = newSalt.toString("hex");
  }

  const salt = Buffer.from(user.salt, "hex");
  const key = crypto.pbkdf2Sync(user.secret, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256");

  return { key, salt };
};
