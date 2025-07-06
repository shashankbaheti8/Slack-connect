import { useState, useEffect } from "react";
import ChannelSelect from "./ChannelSelect";
import DateTimePicker from "./DateTimePicker";
import axios from "axios";

const MessageComposer = () => {
  const [channelId, setChannelId] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [sendType, setSendType] = useState<"now" | "schedule">("now");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [teamId, setTeamId] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedTeamId = localStorage.getItem("team_id");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    } else {
      alert("Team not authorized. Please log in again.");
    }
  }, []);

  const handleSubmit = async () => {
    if (!channelId || !message || !teamId) {
      return alert("Please select a channel, enter a message, and ensure team_id exists.");
    }

    if (sendType === "schedule") {
      if (!scheduleTime) return alert("Select a schedule time.");
      const now = new Date();
      if (scheduleTime.getTime() <= now.getTime()) {
        return alert("Schedule time must be in the future.");
      }
    }

    setLoading(true);
    setFeedback("");

    try {
      const payload: any = {
        team_id: teamId,
        channel_id: channelId,
        message,
      };

      if (sendType === "schedule") {
        payload.send_time = scheduleTime?.toISOString();
      }

      await axios.post(
        `${baseURL}/api/message/${sendType === "now" ? "send" : "schedule"}`,
        payload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setFeedback(`✅ Message ${sendType === "now" ? "sent" : "scheduled"}!`);
      setMessage("");
      setScheduleTime(null);
    } catch (err) {
      console.error("Submission error:", err);
      setFeedback("❌ Failed to send or schedule message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Send or Schedule a Slack Message</h2>

      {/* Mode selector */}
      <div className="flex gap-6 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="sendType"
            value="now"
            checked={sendType === "now"}
            onChange={() => setSendType("now")}
          />
          <span>Send Now</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="sendType"
            value="schedule"
            checked={sendType === "schedule"}
            onChange={() => setSendType("schedule")}
          />
          <span>Schedule for Later</span>
        </label>
      </div>

      <div className="space-y-4">
        <ChannelSelect selected={channelId} onChange={setChannelId} />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your message..."
          className="w-full border p-2 rounded"
        />

        {sendType === "schedule" && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick a Date & Time
            </label>
            <DateTimePicker value={scheduleTime} onChange={setScheduleTime} />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white text-center ${
            sendType === "now"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {sendType === "now" ? "Send Now" : "Schedule Message"}
        </button>

        {feedback && (
          <p className="text-sm text-green-600 text-center">{feedback}</p>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;
