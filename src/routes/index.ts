import express from "express";
import ticketPaymentRoutes from "./ticketPayments";
import showRoutes from "./shows";

const app = express();

app.use(express.json());

app.use(ticketPaymentRoutes);
app.use(showRoutes);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error });
});

app.listen(process.env.PORT);
