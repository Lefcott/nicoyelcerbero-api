import express from "express";
import runCronJob from "./runCronJob";

const router = express.Router();

router.use("/cron-jobs", runCronJob);

export default router;
