import express from "express";
import mercadopago from "mercadopago";
import Show from "../../models/show";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

const router = express.Router();

router.get("/:showKey", async (req, res) => {
  const { showKey } = req.params;
  const show = await Show.findOne({ active: true, key: showKey });

  if (!show) {
    return res.status(404).json({ error: "show not found" });
  }

  res.json({
    ...show.toJSON(),
    feeMultiplier: +(process.env.PAYMENT_FEE_MULTIPLIER || ""),
  });
});

export default router;
