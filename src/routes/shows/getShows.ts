import express from "express";
import mercadopago from "mercadopago";
import Show from "../../models/show";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

const router = express.Router();

router.get("/", async (req, res) => {
  const shows = await Show.find({ active: true });

  res.json(shows);
});

export default router;
