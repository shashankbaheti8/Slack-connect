import express, { Request, Response } from "express";
import slackClient from "../utils/slackClient";
import { WebClient } from "@slack/web-api";
import UserToken from "../models/UserToken";
import ScheduledMessage from "../models/ScheduledMessage";
import mongoose from "mongoose";

const router = express.Router();

// POST /api/message/send
router.post("/send", async (req: Request, res: Response) => {
    const { channel_id, message, team_id } = req.body;

    if (!channel_id || !message || !team_id) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        const user = await UserToken.findOne({ team_id });
        if (!user){
            res.status(404).json({ error: "Team not authorized" });
            return; 
        } 
            

        const slackClient = new WebClient(user.access_token);

        const result = await slackClient.chat.postMessage({
            channel: channel_id,
            text: message,
        });

        res.json({ ok: true, ts: result.ts });
    } catch (err) {
        console.error("Send error:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// POST /api/message/schedule

router.post("/schedule", async (req: Request, res: Response) => {
  const { team_id, channel_id, message, send_time } = req.body;

  if (!team_id || !channel_id || !message || !send_time) {
      res.status(400).json({ error: "Missing required fields" });
      return;
  }

  try {
    const user = await UserToken.findOne({ team_id });
    if (!user) {
        res.status(404).json({ error: "Team not authorized" });
        return; 
    }
    const slackClient = new WebClient(user.access_token);

    // ✅ Fetch channel info from Slack
    const channelInfo = await slackClient.conversations.info({
      channel: channel_id,
    });

    const channel_name = (channelInfo.channel as any)?.name || "unknown";

    const doc = await ScheduledMessage.create({
      team_id,
      channel_id,
      channel_name, // ✅ Store human-readable name
      message,
      send_time: new Date(send_time),
    });

    res.json({ ok: true, id: doc._id });
    return; 
  } catch (err) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Failed to schedule message" });
    return;
  }
});


// GET /api/message/scheduled
router.get("/scheduled", async (req: Request, res: Response) => {
    try {
        const messages = await ScheduledMessage.find({ sent: false }).sort({ send_time: 1 });
        res.json({ ok: true, messages });
    } catch (err) {
        console.error("Fetch scheduled error:", err);
        res.status(500).json({ error: "Failed to fetch scheduled messages" });
    }
});

// DELETE /api/message/scheduled/:id
router.delete("/scheduled/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }

    try {
        const deleted = await ScheduledMessage.findByIdAndDelete(id);

        if (!deleted) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        res.json({ ok: true, message: "Cancelled successfully" });
    } catch (err) {
        console.error("Cancel error:", err);
        res.status(500).json({ error: "Failed to cancel message" });
    }
});


export default router;
