import mongoose, { Schema } from "mongoose";

export interface GuestInterface {
  firstName: string;
  lastName: string;
}

export interface TicketPaymentInterface {
  paymentExternalId: string;
  showKey: string;
  payerEmail: string;
  guests: GuestInterface[];
  status: string;
}

const ticketPaymentSchema = new Schema<TicketPaymentInterface>({
  paymentExternalId: { type: String, required: true },
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
