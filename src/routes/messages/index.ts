import express from "express";
import createMessageRouter from "./createMessage";
import getMessagesRouter from "./getMessages";

const router = express.Router();

router.use("/messages", createMessageRouter);
router.use("/messages", getMessagesRouter);

export default router;
