import "./init";
import TicketPayment from "../models/ticketPayment";
import { wait } from "../utils/wait";
import mercadopago from "../utils/mercadopago";
import { addGuestsToShow } from "../utils/addGuestsToShow";
import { PaymentGetResponse } from "mercadopago/resources/payment";

export const run = async () => {
  const ticketPayments = await TicketPayment.find({
    status: "pending",
    paymentExternalId: { $exists: true },
  });
  console.log("checking payments", ticketPayments);

  for (let i = 0; i < ticketPayments.length; i += 1) {
    const ticketPayment = ticketPayments[i];
    let payment: PaymentGetResponse;

    try {
      payment = await mercadopago.payment.get(+ticketPayment.paymentExternalId);
    } catch (error) {
      console.log("Failed to get payment from mercadopago");
      console.error(error);
      continue;
    }

    if (ticketPayment.status !== payment.body.status) {
      ticketPayment.status = payment.body.status;
      await ticketPayment.save();
    }
    if (payment.body.status === "approved") {
      await addGuestsToShow(ticketPayment);
    }
    await wait(500);
  }
};
