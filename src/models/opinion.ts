import mongoose, { Schema } from "mongoose";

export interface OpinionInterface {
  text: string;
}

const opinionSchema = new Schema<OpinionInterface>({
  text: { type: String, required: true },
});

const Opinion = mongoose.model("Opinion", opinionSchema, "opinions");

export default Opinion;
