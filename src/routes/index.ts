import ticketPaymentRoutes from "./ticketPayments";
import payentEvents from "./paymentEvents";
import showRoutes from "./shows";
import cronJobRoutes from "./cron-jobs";
import app from "./middlewares";

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
