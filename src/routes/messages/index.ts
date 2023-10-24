import express from "express";
import createMessageRouter from "./createMessage";

const router = express.Router();

router.use("/messages", createMessageRouter);

export default router;
