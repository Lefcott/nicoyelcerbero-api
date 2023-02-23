import express from "express";
import { check, body, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import TicketPayment from "../../../models/ticketPayment";
import { cancelTickets, getAlreadyRefundedGuestNames } from "./utils";

const router = express.Router();

router.post(
  "/:ticketPaymentId/refunds",
  body("guestIds").isArray({ min: 1, max: 10 }),
  check("guestIds.*").isString().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const ticketPaymentId = req.params?.ticketPaymentId;
      const token = req.query?.token;
      const { guestIds } = req.body;

      if (!isValidObjectId(ticketPaymentId)) {
        return res.status(400).json({ error: "invalid ticket payment id" });
      }

      const ticketPayment = await TicketPayment.findById(ticketPaymentId);

      if (!ticketPayment) {
        return res.status(404).json({ error: "ticket payment not found" });
      }

      if (token !== ticketPayment.refundToken) {
        return res.status(401).json({ error: "incorrect refund token" });
      }

      const refundedGuests = getAlreadyRefundedGuestNames(
        ticketPayment,
        guestIds
      );

      console.log("refundedGuests", refundedGuests);
      if (refundedGuests.length) {
        return res.status(400).json({
          error: "ticket/s already refunded",
          code: "ticketsAlreadyRefunded",
          refundedGuests,
        });
      }

      await cancelTickets(ticketPayment, guestIds);

      res.json({ message: "tickets were refunded" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
