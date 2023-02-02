import express from "express";
import cors from "cors";

import requestLoggerMiddleware from "./log";
import moesifMiddleware from "./moesif";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use(moesifMiddleware);

export default app;
