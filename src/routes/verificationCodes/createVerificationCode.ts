import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail } from "../../utils/sendEmail";
import EmailVerificationCode from "../../models/emailVerificationCode";

const router = express.Router();

router.post(
  "/",
  body("email").isString().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const code = Array(6)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
        .join("");

      await EmailVerificationCode.updateOne(
        { email },
        { $set: { code } },
        { upsert: true }
      );

      await sendEmail("emailVerification", email, {
        code,
      });

      res.json({ message: "email sent" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
