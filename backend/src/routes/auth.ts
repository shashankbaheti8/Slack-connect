import express, { Request, Response, RequestHandler } from "express";
import axios from "axios";
import dotenv from "dotenv";
import UserToken from "../models/UserToken";

dotenv.config();

const router = express.Router();

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;
const SLACK_REDIRECT_URI = process.env.SLACK_REDIRECT_URI!;

// Step 1: Redirect to Slack OAuth
router.get("/slack", (_req: Request, res: Response) => {
  const slackAuthURL = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:read,chat:write,chat:write.public,users:read,channels:join&redirect_uri=${SLACK_REDIRECT_URI}`;
  res.redirect(slackAuthURL);
});

// Step 2: Handle Slack OAuth Callback
const slackCallbackHandler: RequestHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send("No code received");
    return;
  }

  try {
    const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
      params: {
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
        redirect_uri: SLACK_REDIRECT_URI,
      },
    });

    const data = response.data;

    if (!data.ok) {
      res.status(400).json({ error: data.error });
      return;
    }

    const { access_token, team, authed_user, scope } = data;

    // ✅ Save or update token
    await UserToken.findOneAndUpdate(
      { team_id: team.id },
      {
        team_id: team.id,
        team_name: team.name,
        user_id: authed_user.id,
        access_token,
        scope,
      },
      { upsert: true, new: true }
    );

  return res.redirect(`${process.env.FRONTEND_URL}/?team_id=${team.id}`);

  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("Slack auth failed");
    return;
  }
};

router.get("/slack/callback", slackCallbackHandler);

export default router;
