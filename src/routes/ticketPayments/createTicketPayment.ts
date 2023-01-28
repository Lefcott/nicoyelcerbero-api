import express from "express";
import { check, body, validationResult } from "express-validator";
import mercadopago from "mercadopago";
import Show from "../../models/show";
import TicketPayment from "../../models/ticketPayment";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

const router = express.Router();

router.post(
  "/",
  body("showKey").isString(),
  body("payerEmail").isString(),
  body("guests").isArray({ min: 1, max: 10 }),
  check("guests.*.firstName").not().isEmpty(),
  check("guests.*.lastName").not().isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { showKey, payerEmail, guests } = req.body;
      const show = await Show.findOne({ key: showKey });

      if (!show) {
        return res.status(404).json({ error: "show not found" });
      }

      const preference = await mercadopago.preferences.create({
        items: [
          {
            title: `Entradas para ${guests.join(", ")}`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: (show.presalePrice || 0) * guests.length,
          },
        ],
      });

      const ticketPayment = new TicketPayment({
        showKey,
        payerEmail,
        guests,
        preferenceId: preference.body.id,
      });

      await ticketPayment.save();

      res.json({ preferenceId: preference.body.id });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
