interface Props {
  jsx: string;
  css: string;
}

export default function CodeTabs({ jsx, css }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <h3 className="font-semibold mb-1">JSX</h3>
        <pre className="bg-black text-white p-3 rounded h-60 overflow-auto">
          <code>{jsx}</code>
        </pre>
      </div>
      <div>
        <h3 className="font-semibold mb-1">CSS</h3>
        <pre className="bg-black text-white p-3 rounded h-60 overflow-auto">
          <code>{css}</code>
        </pre>
      </div>
    </div>
  );
}
