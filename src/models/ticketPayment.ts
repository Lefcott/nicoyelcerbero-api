import mongoose, { Schema } from "mongoose";

interface GuestInterface {
  firstName: string;
  lastName: string;
}

interface TicketPaymentInterface {
  showKey: string;
  payerEmail: string;
  guests: GuestInterface[];
  preferenceId: string;
}

const ticketPaymentSchema = new Schema<TicketPaymentInterface>({
  showKey: { type: String, required: true },
  payerEmail: { type: String, required: true },
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
  ],
  preferenceId: { type: String, required: true },
});

const TicketPayment = mongoose.model("TicketPayment", ticketPaymentSchema);

export default TicketPayment;
