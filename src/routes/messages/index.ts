import express from "express";
import createConversationRouter from "./createConversation";
import createMessageRouter from "./createMessage";
import getMessagesRouter from "./getMessages";

const router = express.Router();

router.use("/conversations", createConversationRouter);
router.use("/messages", createMessageRouter);
router.use("/messages", getMessagesRouter);

export default router;
