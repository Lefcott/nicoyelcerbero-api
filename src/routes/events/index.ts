import express from "express";
import createEventRouter from "./createEvent";

const router = express.Router();

router.use("/events", createEventRouter);

export default router;
