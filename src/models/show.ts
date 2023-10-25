import axios from "axios";
import mongoose, { Schema } from "mongoose";
import showDetailsPageSocket from "../sockets/showDetailsPage";
import ShowKey from "./showKey";
import { GuestInterface } from "./ticketPayment";

export interface ShowInterface {
  _id: string;
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
  locationPhotos: string[];
  previousShows: { videoUrl: string; title: string; linkTwUrl?: string }[];
  onlyAdults: boolean;
  guests: GuestInterface[];
  chatEnabled: boolean;
  feePayer: "buyer" | "seller" | "both";
  showDate: Date;
  cancellationHours: number;
}

const showSchema = new Schema<ShowInterface>({
  key: { type: String, required: true, unique: true },
  active: { type: Boolean, required: true },
  flyerUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  date: { type: String, required: true },
  isFree: { type: Boolean, required: true },
  chatEnabled: { type: Boolean, default: false },
  presalePrice: Number,
  indoorPrice: Number,
  locationName: { type: String, required: true },
  address: { type: String, required: true },
  addressUrl: { type: String, required: true },
  onlyAdults: { type: Boolean, required: true },
  locationPhotos: [String],
  previousShows: [
    {
      videoUrl: String,
      linkTwUrl: String,
      title: String,
    },
  ],
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      cancelled: { type: Boolean, default: false },
    },
  ],
  feePayer: { type: String, required: true },
  showDate: Date,
  cancellationHours: { type: Number, default: 8 },
});

const Show = mongoose.model("Show", showSchema, "shows");

if (process.env.REVALIDATION_ENABLED === "true") {
  Show.watch().on("change", async (data) => {
    try {
      console.log("reval data", data);

      // @ts-ignore
      const showId = data.documentKey._id;
      let showKey: string;

      if (!showId) {
        return;
      }
      const pathsToRevalidate = ["/"];

      switch (data.operationType) {
        case "insert":
          {
            // Set key to revalidate path
            showKey = data.fullDocument.key;

            if (!showKey) {
              // Cannot revalidate path or create a show-key association, this won't impact the cache
              console.error(
                `inserted document doesnt have key, show id: ${showId}`
              );
              return;
            }

            // Associate show id with key
            await new ShowKey({
              showId,
              showKey,
            })
              .save()
              .catch(() => {
                console.log(
                  "ShowKey was not inserted (might've been created by another server instance)"
                );
              });

            showKey = data.fullDocument.key;
          }
          break;
        case "delete": {
          const showKeyDoc = await ShowKey.findOneAndDelete({ showId });
          if (showKeyDoc) {
            // Set key to revalidate path
            showKey = showKeyDoc.showKey;
          } else {
            // Cannot revalidate path, the page cachhe will be kept
            console.error(`didnt find deleted show with id ${showId}`);
            return;
          }
          break;
        }
        case "update": {
          const { updatedFields } = data.updateDescription;
          const updatedKey = updatedFields?.key;

          if (updatedFields) {
            console.log("updatedFields", updatedFields);
            showDetailsPageSocket.emit("showUpdated", {
              ...updatedFields,
              _id: showId,
            });
          }

          if (updatedKey) {
            // Invalidate the old key if the key was updated
            const showKeyDoc = await ShowKey.findOneAndUpdate(
              { showId },
              { $set: { showKey: updatedKey } }
            );

            if (showKeyDoc) {
              // Invalidate the old key
              pathsToRevalidate.push(`/${showKeyDoc.showKey}`);
            } else {
              // Page with old key won't be revalidated, but an association will be created
              await new ShowKey({
                showId,
                showKey: updatedKey,
              })
                .save()
                .catch(() => {
                  console.log(
                    "ShowKey was not inserted (might've been created by another server instance)"
                  );
                });
            }
            // Set key to revalidate path
            showKey = updatedKey;
          } else {
            // Lookup show key to revalidate
            const show = await Show.findById(showId);

            // Cannot revalidate path, the show key is not available, the page cachhe will be kept
            if (!show) {
              console.error(`didnt find deleted show with ${showId}`);
              return;
            }

            // Set key to revalidate path
            showKey = show.key;
          }

          break;
        }
        default: {
          // Operation not supported
          return;
        }
      }

      pathsToRevalidate.push(`/${showKey}`);

      console.log("revalidating", pathsToRevalidate);

      axios
        .post(
          `${process.env.WEB_URL}/api/revalidate`,
          { paths: pathsToRevalidate },
          { params: { token: process.env.REVALIDATION_TOKEN } }
        )
        .then(() => {
          console.log("cache was revalidated");
        });
    } catch (error) {
      console.error(error);
    }
  });
}

export default Show;
