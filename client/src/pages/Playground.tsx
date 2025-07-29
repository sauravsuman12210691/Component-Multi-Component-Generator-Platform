import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sessionAPI } from "../lib/api";
import Chat from "../components/Chat";
import LivePreview from "../components/LivePreview";
import CodeTabs from "../components/CodeTabs";

export default function Playground() {
  const { id } = useParams(); // session ID from URL
  const [sessionId, setSessionId] = useState<string>('');
  const [jsx, setJsx] = useState('');
  const [css, setCss] = useState('');

  useEffect(() => {
    if (id) {
      setSessionId(id);

      // Optional: fetch existing session data
      const fetchSessionData = async () => {
        try {
          const session = await sessionAPI.getSession(id);
          if (session.jsx) setJsx(session.jsx);
          if (session.css) setCss(session.css);
        } catch (error) {
          console.error('Error fetching session data:', error);
        }
      };

      fetchSessionData();
    }
  }, [id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      <div className="col-span-1 p-4 border-r">
        <Chat sessionId={sessionId} setJsx={setJsx} setCss={setCss} />
      </div>
      <div className="col-span-2 p-4 flex flex-col gap-4">
        <LivePreview jsx={jsx} css={css} />
        <CodeTabs jsx={jsx} css={css} />
      </div>
    </div>
  );
}
