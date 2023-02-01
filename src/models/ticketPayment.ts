import mongoose, { Schema } from "mongoose";

export interface GuestInterface {
  firstName: string;
  lastName: string;
}

export interface TicketPaymentInterface {
  paymentInternalId: string;
  paymentExternalId: string;
  showKey: string;
  payerEmail: string;
  guests: GuestInterface[];
  status: string;
}

const ticketPaymentSchema = new Schema<TicketPaymentInterface>({
  paymentInternalId: { type: String, required: true },
  paymentExternalId: String,
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
