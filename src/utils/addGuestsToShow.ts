import { Document, Types } from "mongoose";
import Show from "../models/show";
import { TicketPaymentInterface } from "../models/ticketPayment";
import { sendEmail } from "./sendEmail";

const notificationEmails = (process.env.NOTIFICATION_EMAILS || "").split(",");

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
  const totalGuests = show?.guests.filter((guest) => !guest.cancelled);

  await sendEmail("ticketConfirmation", ticketPayment.payerEmail, {
    guests: ticketPayment.guests,
    show,
    refundUrl: `${process.env.WEB_URL}/reembolsos/${
      ticketPayment._id
    }?token=${encodeURIComponent(ticketPayment.refundToken)}`,
  });

  await sendEmail("ticketPurchased", notificationEmails, {
    guests: ticketPayment.guests,
    payerEmail: ticketPayment.payerEmail,
    guestNames: ticketPayment.guests
      .map((guest) => `${guest.firstName} ${guest.lastName}`)
      .join(", "),
    show,
    totalGuests: (totalGuests || [])
      .map((guest) => `${guest.firstName} ${guest.lastName}`)
      .sort(),
  });
};
