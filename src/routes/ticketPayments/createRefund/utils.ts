import mercadopago from "mercadopago";
import { Document, Types } from "mongoose";
import Show from "../../../models/show";
import TicketPayment, {
  TicketPaymentInterface,
} from "../../../models/ticketPayment";
import { sendEmail } from "../../../utils/sendEmail";

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
  let amountToRefund =
    ((ticketPayment.paidAmount || 0) * guestIds.length) /
    ticketPayment.guests.length;
  amountToRefund = Math.floor(amountToRefund * 100) / 100;

  const guestsToRefund = guestIds.map((guestId) =>
    ticketPayment.guests.find((guest) => guest._id.toString() === guestId)
  );

  await mercadopago.refund.create({
    payment_id: ticketPayment.paymentExternalId,
    amount: amountToRefund,
  });

  await Promise.all([
    TicketPayment.updateOne(
      { _id: ticketPayment._id, "guests._id": { $in: guestIds } },
      { $set: { "guests.$[elem].cancelled": true } },
      { arrayFilters: [{ "elem._id": { $in: guestIds } }], multi: true }
    ),
    Show.updateOne(
      { key: ticketPayment.showKey, "guests._id": { $in: guestIds } },
      { $set: { "guests.$[elem].cancelled": true } },
      { arrayFilters: [{ "elem._id": { $in: guestIds } }], multi: true }
    ),
  ]);

  await sendEmail("refundSuccessful", ticketPayment.payerEmail, {
    guests: guestsToRefund,
  });
};
