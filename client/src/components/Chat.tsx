import { useState } from 'react';
import { aiAPI, sessionAPI } from '../lib/api';

interface Props {
  sessionId: string;
  setJsx: (code: string) => void;
  setCss: (code: string) => void;
}

export default function Chat({ sessionId, setJsx, setCss }: Props) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

 const handleGenerate = async () => {
  try {
    setLoading(true);
    const res = await aiAPI.generateCode({
      prompt,
      sessionId,
      existingCode: { jsx: '', css: '' },
    });

    console.log("AI response:", res); // Add this line

    if (!res || !res.jsx || !res.css) {
      throw new Error("Invalid AI response. jsx or css is missing.");
    }

    setJsx(res.jsx.trim());
    setCss(res.css.trim());

    await sessionAPI.updateSession(sessionId, {
      chatHistory: [
        {
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
        {
          role: 'assistant',
          content: `\`\`\`jsx\n${res.jsx}\n\`\`\`\n\`\`\`css\n${res.css}\n\`\`\``,
          timestamp: new Date().toISOString(),
        },
      ],
      jsx: res.jsx,
      css: res.css,
    });
  } catch (err) {
    console.error("Error in handleGenerate:", err);
    alert('Failed to generate code');
  } finally {
    setLoading(false);
  }
};


  const handleTweak = async () => {
    try {
      setLoading(true);
      const res = await aiAPI.tweakCode({
        sessionId,
        tweakPrompt: prompt,
      });

      setJsx(res.jsx.trim());
      setCss(res.css.trim());

      await sessionAPI.updateSession(sessionId, {
        chatHistory: [
          {
            role: 'user',
            content: `Tweak: ${prompt}`,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: `\`\`\`jsx\n${res.jsx}\n\`\`\`\n\`\`\`css\n${res.css}\n\`\`\``,
            timestamp: new Date().toISOString(),
          },
        ],
        jsx: res.jsx,
        css: res.css,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to tweak code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="w-full border p-2 rounded"
        rows={6}
        placeholder="Prompt or tweak instruction"
      />
      <button className="btn w-full bg-blue-600 text-white" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      <button className="btn w-full bg-gray-200" onClick={handleTweak} disabled={loading}>
        {loading ? 'Tweaking...' : 'Tweak'}
      </button>
    </div>
  );
}
