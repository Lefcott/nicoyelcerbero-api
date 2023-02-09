import express from "express";
import { body, validationResult } from "express-validator";
import EmailVerificationCode from "../../models/emailVerificationCode";

const router = express.Router();

router.post(
  "/:email/validations",
  body("code").isString().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.params as Record<any, any>;
      const { code } = req.body;

      const emailVerificationCode = await EmailVerificationCode.findOne({
        email,
        code,
      });

      res.json(!!emailVerificationCode);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
