import express from "express";
import createOpinionRouter from "./createOpinion";

const router = express.Router();

router.use("/opinions", createOpinionRouter);

export default router;
