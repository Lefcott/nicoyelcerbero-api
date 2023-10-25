import express from "express";
import { body, validationResult } from "express-validator";
import Event from "../../models/event";
import { sendEmail } from "../../utils/sendEmail";

const router = express.Router();
const notificationEmails = (process.env.NOTIFICATION_EMAILS || "").split(",");

router.post(
  "/",
  body("name").isString().notEmpty(),
  body("pageVisitId").isString().notEmpty(),
  body("description").isString().optional(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, pageVisitId, description } = req.body;

      if (name === "PageOpenedFromAd") {
        await sendEmail("pageOpenedFromAd", notificationEmails, {
          pageVisitId,
          chatToken: process.env.CHAT_TOKEN,
        });
      }

      await new Event({ name, pageVisitId, description }).save();

      res.json({ message: "event created" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
