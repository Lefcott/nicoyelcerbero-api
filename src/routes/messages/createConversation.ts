import express from "express";
import { body, validationResult } from "express-validator";
import Conversation from "../../models/conversation";
import conversationSocket from "../../sockets/conversation";

const router = express.Router();

router.post(
  "/",
  body("chatToken").isString(),
  body("pageVisitId").isString(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { chatToken, pageVisitId } = req.body;

      if (chatToken !== process.env.CHAT_TOKEN) {
        return res.status(401).json({
          message: "invalid chat token",
        });
      }

      let conversation = await Conversation.findOne({ pageVisitId });

      if (!conversation) {
        conversation = await new Conversation({
          pageVisitId,
          messages: [],
        }).save();
        conversationSocket.emit("newConversation", {
          pageVisitId,
          conversationId: conversation._id,
        });
      }

      res.json({
        message: "conversation created",
        conversationId: conversation._id,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
