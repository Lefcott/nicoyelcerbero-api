import express from "express";
import createVerificationCodeRouter from "./createVerificationCode";
import validateVerificationCodeRouter from "./validateVerificationCode";

const router = express.Router();

router.use("/verificationCodes", createVerificationCodeRouter);
router.use("/verificationCodes", validateVerificationCodeRouter);

export default router;
