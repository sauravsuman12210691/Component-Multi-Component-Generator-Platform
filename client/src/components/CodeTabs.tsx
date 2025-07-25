import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeTabsProps {
  jsx: string;
  css: string;
  onExport: () => void;
}

const CodeTabs: React.FC<CodeTabsProps> = ({ jsx, css, onExport }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const renderPreview = () => {
    if (!jsx && !css) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Preview Available</h3>
            <p className="text-muted-foreground text-sm">
              Start a conversation to generate components and see them here.
            </p>
          </div>
        </div>
      );
    }

    try {
      // This is a simplified preview - in a real app you'd want a more sophisticated iframe or sandboxed rendering
      return (
        <div className="h-full">
          <style>{css}</style>
          <div 
            dangerouslySetInnerHTML={{ __html: jsx }} 
            className="p-6 h-full overflow-auto"
          />
        </div>
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-xl">!</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
            <p className="text-muted-foreground text-sm">
              There's an issue with the generated code. Check the JSX and CSS tabs for details.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Code & Preview</h2>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          disabled={!jsx && !css}
          className="transition-smooth"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="preview" className="transition-smooth">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="jsx" className="transition-smooth">
              JSX
            </TabsTrigger>
            <TabsTrigger value="css" className="transition-smooth">
              CSS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 m-0 rounded-none border-0">
            <div className="h-full bg-background border border-border rounded-lg m-4">
              {renderPreview()}
            </div>
          </TabsContent>

          <TabsContent value="jsx" className="flex-1 m-0 rounded-none border-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">JSX Code</h3>
                <Button
                  onClick={() => copyToClipboard(jsx, 'JSX')}
                  variant="ghost"
                  size="sm"
                  disabled={!jsx}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <ScrollArea className="flex-1 px-4">
                {jsx ? (
                  <SyntaxHighlighter
                    language="jsx"
                    style={oneDark}
                    customStyle={{
                      background: 'hsl(var(--code-bg))',
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    wrapLongLines
                  >
                    {jsx}
                  </SyntaxHighlighter>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                    No JSX code generated yet
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="css" className="flex-1 m-0 rounded-none border-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">CSS Code</h3>
                <Button
                  onClick={() => copyToClipboard(css, 'CSS')}
                  variant="ghost"
                  size="sm"
                  disabled={!css}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <ScrollArea className="flex-1 px-4">
                {css ? (
                  <SyntaxHighlighter
                    language="css"
                    style={oneDark}
                    customStyle={{
                      background: 'hsl(var(--code-bg))',
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    wrapLongLines
                  >
                    {css}
                  </SyntaxHighlighter>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                    No CSS code generated yet
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CodeTabs;