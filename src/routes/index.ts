import express from "express";
import cors from "cors";

import ticketPaymentRoutes from "./ticketPayments";
import payentEvents from "./paymentEvents";
import showRoutes from "./shows";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ticketPaymentRoutes);
app.use(payentEvents);
app.use(showRoutes);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error });
});

app.listen(process.env.PORT || 3001);
