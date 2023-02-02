import mongoose, { Schema } from "mongoose";

export interface ShowKeyInterface {
  showId: string;
  showKey: string;
}

const showKeySchema = new Schema<ShowKeyInterface>({
  showId: { type: String, required: true },
  showKey: { type: String, required: true, unique: true },
});

const ShowKey = mongoose.model("ShowKey", showKeySchema, "showKeys");

export default ShowKey;
