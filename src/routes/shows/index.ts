import express from "express";
import getShows from "./getShows";

const router = express.Router();

router.use("/shows", getShows);

export default router;
