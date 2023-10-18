import ticketPaymentRoutes from "./ticketPayments";
import payentEvents from "./paymentEvents";
import showRoutes from "./shows";
import verificationCodesRoutes from "./verificationCodes";
import cronJobRoutes from "./cron-jobs";
import opinionRoutes from "./opinions";
import eventsRoutes from "./events";
import app from "./middlewares";

app.use(ticketPaymentRoutes);
app.use(payentEvents);
app.use(showRoutes);
app.use(verificationCodesRoutes);
app.use(cronJobRoutes);
app.use(opinionRoutes);
app.use(eventsRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error, errorMessage: error.message });
  res.end();
});
