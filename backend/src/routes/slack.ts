import express, { Request, Response } from "express";
import slackClient from "../utils/slackClient";

const router = express.Router();

router.get("/channels", async (_req: Request, res: Response) => {
    try {
        const result = await slackClient.conversations.list({
            types: "public_channel",
        });

        if (!result.ok) {
            res.status(500).json({ error: "Failed to fetch channels" });
            return;
        }

        const channels = result.channels?.map((ch: any) => ({
            id: ch.id,
            name: ch.name,
        }));

        res.json({ ok: true, channels });
    } catch (err) {
        console.error("Slack channel fetch error:", err);
        res.status(500).json({ error: "Failed to fetch channels" });
    }
});

export default router;
