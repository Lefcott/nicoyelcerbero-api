import io from ".";
import UserActivity from "../models/userActivity";

const showDetailsPageSocket = io.of("showDetailsPage");

showDetailsPageSocket.on("connection", async (connection) => {
  // @ts-ignore
  const { pageVisitId } = connection.request._query;

  if (pageVisitId) {
    await new UserActivity({ pageVisitId }).save().catch((error) => {
      console.error("error saving user activity", error);
    });
  }

  connection.on("disconnect", async () => {
    if (pageVisitId) {
      const userActivity = await UserActivity.findOne({ pageVisitId });
      if (userActivity) {
        userActivity.timeElapsed = Math.floor(
          (+new Date() - +userActivity.createdAt) / 1000
        );
        await userActivity.save();
      }
    }
  });
});

export default showDetailsPageSocket;
