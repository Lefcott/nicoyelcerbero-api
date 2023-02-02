import express from "express";
import cors from "cors";

import ticketPaymentRoutes from "./ticketPayments";
import payentEvents from "./paymentEvents";
import showRoutes from "./shows";
import cronJobRoutes from "./cron-jobs";
import requestLoggerMiddleware from "./middlewares/log";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use(ticketPaymentRoutes);
app.use(payentEvents);
app.use(showRoutes);
app.use(cronJobRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error, errorMessage: error.message });
  res.end();
});

app.listen(process.env.PORT || 3001);
