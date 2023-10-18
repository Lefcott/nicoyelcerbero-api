import mongoose, { Schema } from "mongoose";

export interface EventInterface {
  pageVisitId: string;
  name: string;
  description?: string;
  createdAt: Date;
}

const eventSchema = new Schema<EventInterface>({
  pageVisitId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: () => new Date() },
});

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
