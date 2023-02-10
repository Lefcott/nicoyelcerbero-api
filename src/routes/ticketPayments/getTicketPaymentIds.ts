import express from "express";
import TicketPayment from "../../models/ticketPayment";

const router = express.Router();

router.get("/", async (req, res) => {
  const ticketPaymentIds = await TicketPayment.find({}).distinct("_id");

  res.json(ticketPaymentIds);
});

export default router;
