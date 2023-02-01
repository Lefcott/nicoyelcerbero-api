import express from "express";
import createPaymentEvent from "./createPaymentEvent";

const router = express.Router();

router.use("/paymentEvents", createPaymentEvent);

export default router;
