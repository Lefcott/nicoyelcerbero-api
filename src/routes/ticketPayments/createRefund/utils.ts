import { Document, Types } from "mongoose";
import TicketPayment, {
  TicketPaymentInterface,
} from "../../../models/ticketPayment";

const validateGuestRefund = (
  ticketPayment: TicketPaymentInterface,
  guestId: string
) => {
  const guest = ticketPayment.guests.find(
    (guest) => guest._id.toString() === guestId
  );

  return !guest?.cancelled;
};

export const getAlreadyRefundedGuestNames = (
  ticketPayment: TicketPaymentInterface,
  guestIds: string[]
) => {
  return guestIds
    .filter((guestId) => !validateGuestRefund(ticketPayment, guestId))
    .map((guestId) => {
      const guest = ticketPayment.guests.find(
        (guest) => guest._id.toString() === guestId
      );
      return `${guest?.firstName} ${guest?.lastName}`;
    });
};

export const cancelTickets = async (
  ticketPayment: Document<unknown, any, TicketPaymentInterface> &
    TicketPaymentInterface & {
      _id: Types.ObjectId;
    },
  guestIds: string[]
) => {
  await TicketPayment.updateOne(
    { _id: ticketPayment._id, "guests._id": { $in: guestIds } },
    { $set: { "guests.$[elem].cancelled": true } },
    { arrayFilters: [{ "elem._id": { $in: guestIds } }], multi: true }
  );
};
