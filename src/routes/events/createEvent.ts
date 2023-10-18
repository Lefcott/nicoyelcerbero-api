import express from "express";
import { body, validationResult } from "express-validator";
import Event from "../../models/event";

const router = express.Router();

router.post(
  "/",
  body("name").isString().notEmpty(),
  body("pageVisitId").isString().notEmpty(),
  body("description").isString().optional(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, pageVisitId, description } = req.body;

      await new Event({ name, pageVisitId, description }).save();

      res.json({ message: "event created" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
