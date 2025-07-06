import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

type ScheduledMessage = {
  _id: string;
  channel_id: string;
  channel_name: string;
  message: string;
  send_time: string;
};

const baseURL = import.meta.env.VITE_BASE_URL;

const ScheduledMessages = () => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/message/scheduled`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = res.data;
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching scheduled messages:", err);
      setError("Failed to load scheduled messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelMessage = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/api/message/scheduled/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      alert("Failed to cancel message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Scheduled Messages</h2>

      {loading && <p>Loading scheduled messages...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && messages.length === 0 && !error && (
        <p className="text-gray-500">No scheduled messages found.</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg._id}
          className="bg-white shadow rounded p-4 flex justify-between items-start"
        >
          <div>
            <p className="font-semibold text-gray-800">Channel Name: {msg.channel_name}</p>
            <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
            <p className="text-sm text-gray-500 mt-1">
              Scheduled for: {format(new Date(msg.send_time), "PPPp")}
            </p>
          </div>
          <button
            onClick={() => cancelMessage(msg._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScheduledMessages;
