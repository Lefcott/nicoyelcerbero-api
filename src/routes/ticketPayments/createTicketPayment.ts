import express from "express";
import { check, body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import mercadopago from "../../utils/mercadopago";
import Show from "../../models/show";
import TicketPayment from "../../models/ticketPayment";
import { formatUserName } from "../../utils/formatUsername";

const router = express.Router();

router.post(
  "/",
  body("showKey").isString().notEmpty(),
  body("payerEmail").isString().notEmpty(),
  body("guests").isArray({ min: 1, max: 10 }),
  check("guests.*.firstName").not().isEmpty(),
  check("guests.*.lastName").not().isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { showKey, payerEmail } = req.body;
      const guests = req.body.guests.map((guest) => ({
        firstName: formatUserName(guest.firstName, guest.lastName).firstName,
        lastName: formatUserName(guest.firstName, guest.lastName).lastName,
      }));
      const show = await Show.findOne({ key: showKey });

      if (!show) {
        return res.status(404).json({ error: "show not found" });
      }

      const paymentExternalId = uuid();
      const preference = await mercadopago.preferences.create({
        items: [
          {
            title: `Entrada${guests.length > 1 ? "s" : ""} para ${guests.join(
              ", "
            )}`,
            id: paymentExternalId,
            quantity: 1,
            picture_url: show.flyerUrl,
            currency_id: "ARS",
            unit_price: (show.presalePrice || 0) * guests.length,
          },
        ],
      });

      const ticketPayment = new TicketPayment({
        paymentExternalId,
        status: "pending",
        showKey,
        payerEmail,
        guests,
      });

      await ticketPayment.save();

      res.json({ preferenceId: preference.body.id });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
