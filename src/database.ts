import mongoose from "mongoose";

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Connected to MongoDB!"));
