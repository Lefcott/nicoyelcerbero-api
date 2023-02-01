import express from "express";
import getShows from "./getShows";
import getShow from "./getShow";

const router = express.Router();

router.use("/shows", getShows);
router.use("/shows", getShow);

export default router;
