import express from "express";
import { body, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import { sendEmail } from "../../utils/sendEmail";
import Conversation from "../../models/conversation";
import conversationSocket from "../../sockets/conversation";

const router = express.Router();
const notificationEmails = (process.env.NOTIFICATION_EMAILS || "").split(",");

router.post(
  "/",
  body("pageVisitId").isString(),
  body("from").isString().isIn(["user", "admin"]),
  body("chatToken").isString().optional(),
  body("text").isString(),
  body("conversationId")
    .isString()
    .optional()
    .custom((input) => !input || isValidObjectId(input)),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { pageVisitId, from, chatToken, text } = req.body;
      let { conversationId } = req.body;
      const time = new Date().toISOString();

      if (from === "admin" && chatToken !== process.env.CHAT_TOKEN) {
        return res.status(401).json({
          message: "invalid chat token",
        });
      }

      if (!conversationId) {
        const conversation = await new Conversation({
          pageVisitId,
          messages: [{ text, from, time }],
        }).save();
        conversationId = conversation._id;
      } else {
        conversationSocket.emit(
          "newMessage",
          { from, text, time },
          conversationId
        );
        await Conversation.findByIdAndUpdate(conversationId, {
          $push: { messages: { text, from, time } },
        });
      }

      if (from === "user") {
        await sendEmail("messageSentByUser", notificationEmails, {
          text,
          conversationId,
          chatToken: process.env.CHAT_TOKEN,
        });
      }

      res.json({ message: "message created", conversationId });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
