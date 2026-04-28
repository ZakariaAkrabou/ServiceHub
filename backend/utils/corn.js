import cron from "node-cron";
import User from "../models/user.model.js";

export const startCronJobs = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      const result = await User.updateMany(
        {
          isBanned: true,
          "banInfo.expiresAt": { $lte: now },
        },
        {
          $set: {
            isBanned: false,
            banInfo: null,
          },
        }
      );

      console.log(`Auto-unban executed: ${result.modifiedCount} users`);
    } catch (error) {
      console.error("Cron error:", error);
    }
  });
};