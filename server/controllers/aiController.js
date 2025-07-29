const genAI = require('../config/gemini');
const Session = require('../models/Session');

const generateComponent = async (req, res) => {
  const { prompt } = req.body;

  try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const p = `You are an expert frontend developer. Your job is to take any user prompt—no matter how vague, irrelevant, or ambiguous—and interpret it as a request to generate a JSX component along with corresponding CSS.

Output your response in the following JSON format:

{
  "jsx": "/* JSX code here */",
  "css": "/* CSS code here */"
}

Rules:
- Always generate a JSX React component, even if the prompt doesn’t mention UI.
- Use Tailwind if appropriate, otherwise write modular CSS.
- Make assumptions to infer UI meaning if the user is unclear.
- If prompt is totally off-topic (e.g., 'Tell me a joke'), still return a JSX and CSS component inspired by the topic.
this is youser input  : ${prompt}
`
const result = await model.generateContent(prompt);
const text = (await result.response).text();

// Extract code blocks
const jsxMatch = text.match(/```jsx([\s\S]*?)```/);
const cssMatch = text.match(/```css([\s\S]*?)```/);

const jsx = jsxMatch ? jsxMatch[1].trim() : '';
const css = cssMatch ? cssMatch[1].trim() : '';

res.json({ jsx, css, raw: text });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating component');
  }
};

 const tweakComponent = async (req, res) => {
  const { sessionId, tweakPrompt } = req.body;

  try {
    const session = await Session.findOne({ _id: sessionId, user: req.userId });
    if (!session) return res.status(404).send('Session not found');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const tweakInstruction = `
You are a React component designer. The user is tweaking an existing component.
Original JSX:
\`\`\`jsx
${session.componentCode}
\`\`\`

Original CSS:
\`\`\`css
${session.cssCode}
\`\`\`

Tweak Instruction:
"${tweakPrompt}"

Return updated JSX and CSS as separate markdown blocks labeled \`\`\`jsx and \`\`\`css.
`;

    const result = await model.generateContent(tweakInstruction);
    const response = result.response.text();

    // Extract code blocks (optional parsing logic)
    const jsxMatch = response.match(/```jsx([\s\S]*?)```/);
    const cssMatch = response.match(/```css([\s\S]*?)```/);
    const newJSX = jsxMatch ? jsxMatch[1].trim() : '';
    const newCSS = cssMatch ? cssMatch[1].trim() : '';

    // Update session (optional, depending on frontend flow)
    session.chatHistory.push({
      prompt: tweakPrompt,
      response: response,
    });
    session.componentCode = newJSX || session.componentCode;
    session.cssCode = newCSS || session.cssCode;
    await session.save();

    res.json({ jsx: newJSX, css: newCSS, raw: response });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error tweaking component');
  }
};
module.exports = {
  generateComponent,
  tweakComponent,
};