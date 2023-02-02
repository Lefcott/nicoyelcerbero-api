import axios from "axios";
import mongoose, { Schema } from "mongoose";
import { GuestInterface } from "./ticketPayment";

export interface ShowInterface {
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
  guests: GuestInterface[];
  feePayer: "buyer" | "seller" | "both";
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
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
  ],
  feePayer: { type: String, required: true },
});

const Show = mongoose.model("Show", showSchema, "shows");

Show.watch().on("change", async (data) => {
  // @ts-ignore
  const showId = data.documentKey._id;
  const show = await Show.findById(showId);

  // TODO case of removing

  const paths = ["/"];
  if (show) {
    paths.push(`/${show.key}`);
  }
  console.log("revalidating", paths);

  axios
    .post(
      `${process.env.WEB_URL}/api/revalidate`,
      { paths },
      { params: { token: process.env.REVALIDATION_TOKEN } }
    )
    .then(() => {
      console.log("cache was revalidated");
    })
    .catch((error) => {
      console.error(error);
    });
});

export default Show;
