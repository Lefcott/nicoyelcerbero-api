import "./init";
import TicketPayment from "../models/ticketPayment";
import { wait } from "../utils/wait";
import mercadopago from "../utils/mercadopago";
import { addGuestsToShow } from "../utils/addGuestsToShow";

const run = async () => {
  const ticketPayments = await TicketPayment.find({
    status: { $ne: "approved" },
  });

  console.log("ticketPayments", ticketPayments);

  for (let i = 0; i < ticketPayments.length; i += 1) {
    const ticketPayment = ticketPayments[i];
    const payment = await mercadopago.payment.get(
      +ticketPayment.paymentExternalId
    );

    if (ticketPayment.status !== payment.body.status) {
      ticketPayment.status = payment.body.status;
      await ticketPayment.save();
    }
    console.log("payment.body.status", payment.body.status);
    if (payment.body.status === "approved") {
      console.log("adding guests");
      await addGuestsToShow(ticketPayment);
      console.log("added");
    }
    await wait(500);
  }
  process.exit(0);
};

run();
