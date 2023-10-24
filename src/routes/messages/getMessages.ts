import express from "express";
import { query, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import Conversation from "../../models/conversation";

const router = express.Router();

router.get(
  "/",
  query("conversationId")
    .isString()
    .custom((input) => !input || isValidObjectId(input)),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { conversationId } = req.query as { conversationId: string };

      const conversation = await Conversation.findById(conversationId);

      res.json({ messages: conversation?.messages || [] });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
