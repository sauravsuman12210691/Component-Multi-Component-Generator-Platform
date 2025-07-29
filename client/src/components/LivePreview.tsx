import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  jsx: string;
  css: string;
}

export default function LivePreview({ jsx, css }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const document = iframeRef.current?.contentDocument;
    if (!document) return;

    const sanitizedJsx = jsx
      .replace(/<script.*?>.*?<\/script>/gi, '') // prevent script injection
      .replace(/<\/?html>|<\/?body>|<\/?head>/gi, ''); // prevent full doc tags

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          <div id="root">${sanitizedJsx}</div>
        </body>
      </html>
    `;

    document.open();
    document.write(html);
    document.close();
  }, [jsx, css]);

  return (
    <div className="rounded-xl shadow-lg border h-full">
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-[400px] rounded-xl"
      />
    </div>
  );
}
