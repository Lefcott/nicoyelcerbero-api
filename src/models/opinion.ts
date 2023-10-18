import mongoose, { Schema } from "mongoose";

export interface OpinionInterface {
  text: string;
  createdAt: Date;
}

const opinionSchema = new Schema<OpinionInterface>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

const Opinion = mongoose.model("Opinion", opinionSchema, "opinions");

export default Opinion;
