import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MessageComposer from "./components/MessageComposer";
import ScheduledMessages from "./components/ScheduledMessages";
import Landing from "./components/Landing";

function App() {
  const [params] = useSearchParams();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromUrl = params.get("team_id");
    const fromStorage = localStorage.getItem("team_id");

    if (fromUrl) {
      localStorage.setItem("team_id", fromUrl);
      setTeamId(fromUrl);
    } else if (fromStorage) {
      setTeamId(fromStorage);
    }

    setLoading(false);
  }, [params]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return teamId ? (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <MessageComposer />
      <ScheduledMessages />
    </div>
  ) : (
    <Landing />
  );
}

export default App;
