import axios from "axios";
import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import refundPageSocket from "../sockets/refundPage";

export interface GuestInterface {
  _id: string;
  firstName: string;
  lastName: string;
  cancelled: boolean;
}

export interface TicketPaymentInterface {
  paymentInternalId: string;
  paymentExternalId: string;
  refundToken: string;
  showKey: string;
  paidAmount?: number;
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
  paidAmount: Number,
  status: { type: String, required: true },
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      cancelled: { type: Boolean, default: false },
    },
  ],
});

const TicketPayment = mongoose.model(
  "TicketPayment",
  ticketPaymentSchema,
  "ticketPayments"
);

if (process.env.REVALIDATION_ENABLED === "true") {
  console.log("watching");
  TicketPayment.watch().on("change", async (data) => {
    try {
      console.log("reval data", data);

      // @ts-ignore
      const ticketPaymentId = data.documentKey._id;
      let showKey: string;

      if (!ticketPaymentId) {
        return;
      }
      const pathsToRevalidate: string[] = [];

      switch (data.operationType) {
        case "insert": {
          break;
        }
        case "delete": {
          break;
        }
        case "update": {
          const { updatedFields } = data.updateDescription;

          if (
            updatedFields &&
            Object.keys(updatedFields).some((key) => key.startsWith("guests"))
          ) {
            const ticketPayment = await TicketPayment.findById(ticketPaymentId);
            refundPageSocket.emit("ticketPaymentUpdated", ticketPayment);
          }

          break;
        }
        default: {
          // Operation not supported
          return;
        }
      }

      pathsToRevalidate.push(`/reembolsos/${ticketPaymentId}`);

      console.log("revalidating", pathsToRevalidate);

      axios
        .post(
          `${process.env.WEB_URL}/api/revalidate`,
          { paths: pathsToRevalidate },
          { params: { token: process.env.REVALIDATION_TOKEN } }
        )
        .then(() => {
          console.log("cache was revalidated");
        });
    } catch (error) {
      console.error(error);
    }
  });
}

export default TicketPayment;
