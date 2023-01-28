import mongoose, { Schema } from "mongoose";

interface ShowInterface {
  key: string;
  active: boolean;
  flyerUrl: string;
  bannerUrl: string;
  date: string;
  isFree: boolean;
  presalePrice?: number;
  indoorPrice?: number;
  locationName: string;
  address: string;
  addressUrl: string;
  onlyAdults: boolean;
}

const showSchema = new Schema<ShowInterface>({
  key: { type: String, required: true },
  active: { type: Boolean, required: true },
  flyerUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  date: { type: String, required: true },
  isFree: { type: Boolean, required: true },
  presalePrice: Number,
  indoorPrice: Number,
  locationName: { type: String, required: true },
  address: { type: String, required: true },
  addressUrl: { type: String, required: true },
  onlyAdults: { type: Boolean, required: true },
});

const Show = mongoose.model("Show", showSchema);

export default Show;
