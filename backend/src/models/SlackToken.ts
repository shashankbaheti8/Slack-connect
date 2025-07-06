import mongoose from "mongoose";

const slackTokenSchema = new mongoose.Schema({
  access_token: { 
    type: String, 
    required: true 
  },
  team: {
      id: { 
        type: String, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
  },
  authed_user: {
    id: { 
      type: String, 
      required: true 
    },
  },
  scope: String,
  token_type: String,
  bot_user_id: String,
  installed_at: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("SlackToken", slackTokenSchema);
