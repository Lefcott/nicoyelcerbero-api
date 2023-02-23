import express from "express";
import createTicketPaymentRouter from "./createTicketPayment";
import createRefundRouter from "./createRefund";
import getTicketPaymentRouter from "./getTicketPayment";
import getTicketPaymentIdsRouter from "./getTicketPaymentIds";

const router = express.Router();

router.use("/ticketPayments", createTicketPaymentRouter);
router.use("/ticketPayments", createRefundRouter);
router.use("/ticketPayments", getTicketPaymentRouter);
router.use("/ticketPaymentIds", getTicketPaymentIdsRouter);

export default router;
