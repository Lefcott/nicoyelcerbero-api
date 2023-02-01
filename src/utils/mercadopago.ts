import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export default mercadopago;
