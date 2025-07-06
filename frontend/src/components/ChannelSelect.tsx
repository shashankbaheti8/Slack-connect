import { useEffect, useState } from "react";
import axios from "axios";

type Channel = {
  id: string;
  name: string;
};

type Props = {
  selected: string;
  onChange: (id: string) => void;
};

const baseURL = import.meta.env.VITE_BASE_URL;

const ChannelSelect = ({ selected, onChange }: Props) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${baseURL}/api/slack/channels`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then(res => {
        setChannels(res.data.channels);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading channels...</p>;

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full"
    >
      <option value="">Select a channel</option>
      {channels && channels.map((channel) => (
        <option key={channel.id} value={channel.id}>
          #{channel.name}
        </option>
      ))}
    </select>
  );
};

export default ChannelSelect;
