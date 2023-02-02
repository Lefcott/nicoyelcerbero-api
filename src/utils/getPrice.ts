import { ShowInterface } from "../models/show";
import { GuestInterface } from "../models/ticketPayment";

const getFee = (show: ShowInterface, price: number) => {
  const feeMultiplier = +(process.env.PAYMENT_FEE_MULTIPLIER || 0);
  let finalPrice = price;

  if (show.feePayer === "buyer") {
    finalPrice *= 1 / (1 - feeMultiplier);
  } else if (show.feePayer === "both") {
    finalPrice *= 1 / (1 - feeMultiplier / 2);
  }

  return finalPrice - price;
};

export const getPrice = (show: ShowInterface, guests: GuestInterface[]) => {
  let price = (show.presalePrice || 0) * guests.length;
  return price + getFee(show, price);
};
