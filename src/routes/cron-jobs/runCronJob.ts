import express from "express";
import { query } from "express-validator";

import cronJobs from "../../cron-jobs";

const router = express.Router();

router.get(
  "/:cronJobName/executions",
  query("cronToken")
    .isString()
    .equals(process.env.CRON_TOKEN || ""),
  async (req, res, next) => {
    try {
      const cronJobName = req.params?.cronJobName;

      const job = cronJobs[cronJobName];

      if (!job) {
        throw new Error(`Cron job with name ${cronJobName} not found`);
      }

      await job.run();

      res.json({ message: "ok" });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
