import express from "express";
import TicketPayment from "../../models/ticketPayment";

const router = express.Router();

router.get("/:ticketPaymentId", async (req, res) => {
  const { ticketPaymentId } = req.params;
  const ticketPayment = await TicketPayment.findById(ticketPaymentId);

  res.json(ticketPayment);
});

export default router;
