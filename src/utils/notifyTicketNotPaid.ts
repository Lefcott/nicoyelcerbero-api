import { PaymentGetResponse } from "mercadopago/resources/payment";
import { Document, Types } from "mongoose";
import Show from "../models/show";
import { TicketPaymentInterface } from "../models/ticketPayment";
import { sendEmail } from "./sendEmail";

export const notifyTicketNotPaid = async (
  ticketPayment: Document<unknown, any, TicketPaymentInterface> &
    TicketPaymentInterface & {
      _id: Types.ObjectId;
    },
  mercadopagoPayment: PaymentGetResponse
) => {
  const show = await Show.findOne({ key: ticketPayment.showKey });
  await sendEmail("ticketNotPaid", ticketPayment.payerEmail, {
    paymentStatus:
      mercadopagoPayment.body.status === "cancelled"
        ? "cancelado"
        : "rechazado",
    guests: ticketPayment.guests,
    ticketLink: `${process.env.WEB_URL}/${ticketPayment.showKey}`,
    show,
  });
};
