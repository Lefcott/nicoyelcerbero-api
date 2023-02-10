import express from "express";
import { isValidObjectId } from "mongoose";
import TicketPayment from "../../models/ticketPayment";

const router = express.Router();

router.get("/:ticketPaymentId", async (req, res) => {
  const { ticketPaymentId } = req.params;

  if (!isValidObjectId(ticketPaymentId)) {
    return res.json(null);
  }

  const ticketPayment = await TicketPayment.findById(ticketPaymentId);

  res.json(ticketPayment);
});

export default router;
