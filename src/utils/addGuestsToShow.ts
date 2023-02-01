import { Document, Types } from "mongoose";
import Show from "../models/show";
import { TicketPaymentInterface } from "../models/ticketPayment";

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
};
