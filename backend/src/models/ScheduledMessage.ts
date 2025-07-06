import mongoose from "mongoose";

const scheduledMessageSchema = new mongoose.Schema({
  team_id: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: true,
  },
  channel_name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  send_time: {
    type: Date,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  user_id: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model("ScheduledMessage", scheduledMessageSchema);
