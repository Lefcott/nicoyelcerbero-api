import express from "express";
import TicketPayment from "../../models/ticketPayment";
import { addGuestsToShow } from "../../utils/addGuestsToShow";

import mercadopago from "../../utils/mercadopago";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    console.log("payment event received from mercadopago", req.body);
    const payment = await mercadopago.payment.get(req.body.data.id);
    const [{ id: paymentExternalId }] = payment.body.additional_info.items;
    const { status } = payment.body;

    res.json({ message: "OK" });

    const ticketPayment = await TicketPayment.findOneAndUpdate(
      { paymentExternalId },
      { status }
    );

    if (!ticketPayment) {
      console.error(
        `ticket payment with external id ${paymentExternalId} not found`
      );
      return;
    }

    if (status === "approved") {
      await addGuestsToShow(ticketPayment);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
