import express from "express";
import TicketPayment from "../../models/ticketPayment";
import { addGuestsToShow } from "../../utils/addGuestsToShow";

import mercadopago from "../../utils/mercadopago";
import { notifyTicketNotPaid } from "../../utils/notifyTicketNotPaid";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    console.log("payment event received from mercadopago", req.body);
    const { id: paymentExternalId } = req.body.data;
    const payment = await mercadopago.payment.get(req.body.data.id);
    const [{ id: paymentInternalId }] = payment.body.additional_info.items;
    const { transaction_amount: paidAmount } = payment.body;
    const { status } = payment.body;

    res.json({ message: "OK" });

    const ticketPayment = await TicketPayment.findOneAndUpdate(
      { paymentInternalId },
      { paymentExternalId, status, paidAmount }
    );

    if (!ticketPayment) {
      console.error(
        `ticket payment with internal id ${paymentInternalId} not found`
      );
      return;
    }

    if (status === "approved") {
      await addGuestsToShow(ticketPayment);
    } else if (
      payment.body.status === "cancelled" ||
      payment.body.status === "rejected"
    ) {
      await notifyTicketNotPaid(ticketPayment, payment);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
