import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail } from "../../utils/sendEmail";
import Opinion from "../../models/opinion";

const router = express.Router();
const notificationEmails = (process.env.NOTIFICATION_EMAILS || "").split(",");

router.post("/", body("text").isString().notEmpty(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { text } = req.body;

    await new Opinion({ text }).save();

    await sendEmail("opinionCreated", notificationEmails, {
      text,
    });

    res.json({ message: "email sent" });
  } catch (error) {
    next(error);
  }
});

export default router;
