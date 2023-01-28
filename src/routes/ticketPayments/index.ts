import express from "express";
import createTicketPaymentRouter from "./createTicketPayment";

const router = express.Router();

router.use("/ticketPayments", createTicketPaymentRouter);

export default router;
