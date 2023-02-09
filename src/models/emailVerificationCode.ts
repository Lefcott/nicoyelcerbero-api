import mongoose, { Schema } from "mongoose";

export interface EmailVerificationCodeInterface {
  email: string;
  code: string;
}

const emailVerificationCode = new Schema<EmailVerificationCodeInterface>({
  email: { type: String, required: true },
  code: { type: String, required: true },
});

const EmailVerificationCode = mongoose.model(
  "EmailVerificationCode",
  emailVerificationCode,
  "emailVerificationCodes"
);

export default EmailVerificationCode;
