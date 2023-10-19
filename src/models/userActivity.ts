import mongoose, { Schema } from "mongoose";

export interface UserActivityInterface {
  pageVisitId: string;
  timeElapsed: number; // Time the user spent in the page in seconds
  createdAt: Date;
}

const userActivitySchema = new Schema<UserActivityInterface>({
  pageVisitId: { type: String, required: true },
  timeElapsed: { type: Number, default: -1 },
  createdAt: { type: Date, default: () => new Date() },
});

const UserActivity = mongoose.model(
  "UserActivity",
  userActivitySchema,
  "userActivities"
);

export default UserActivity;
