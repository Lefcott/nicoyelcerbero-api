import { Document, Types } from "mongoose";
import Show from "../models/show";
import { TicketPaymentInterface } from "../models/ticketPayment";
import { sendEmail } from "./sendEmail";

export const addGuestsToShow = async (
  ticketPayment: Document<unknown, any, TicketPaymentInterface> &
    TicketPaymentInterface & {
      _id: Types.ObjectId;
    }
) => {
  await Show.updateOne(
    { key: ticketPayment.showKey },
    { $push: { guests: { $each: ticketPayment.guests } } }
  );
  const show = await Show.findOne({ key: ticketPayment.showKey });
  sendEmail("ticketConfirmation", ticketPayment.payerEmail, {
    guests: ticketPayment.guests,
    show,
  });
};
