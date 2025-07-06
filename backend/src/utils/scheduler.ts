import cron from "node-cron";
import ScheduledMessage from "../models/ScheduledMessage";
import slackClient from "./slackClient";

cron.schedule("* * * * *", async () => {
  console.log("⏱ Checking for scheduled messages...");
  const now = new Date();

  const messages = await ScheduledMessage.find({
    send_time: { $lte: now },
    sent: false,
  });

  for (const msg of messages) {
    try {
      await slackClient.chat.postMessage({
        channel: msg.channel_id,
        text: msg.message,
      });
      msg.sent = true;
      await msg.save();
      console.log(`✅ Sent scheduled message: ${msg._id}`);
    } catch (error) {
      console.error(`❌ Failed to send scheduled message ${msg._id}`, error);
    }
  }
});
