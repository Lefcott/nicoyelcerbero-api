import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

export interface GuestInterface {
  firstName: string;
  lastName: string;
}

export interface TicketPaymentInterface {
  paymentInternalId: string;
  paymentExternalId: string;
  refundToken: string;
  showKey: string;
  payerEmail: string;
  guests: GuestInterface[];
  status: string;
}

const ticketPaymentSchema = new Schema<TicketPaymentInterface>({
  paymentInternalId: { type: String, required: true },
  paymentExternalId: String,
  refundToken: {
    type: String,
    default: () => `${uuid()}${uuid()}`.replace(/-/g, "").toUpperCase(),
  },
  showKey: { type: String, required: true },
  payerEmail: { type: String, required: true },
  status: { type: String, required: true },
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
  ],
});

const TicketPayment = mongoose.model(
  "TicketPayment",
  ticketPaymentSchema,
  "ticketPayments"
);

export default TicketPayment;
