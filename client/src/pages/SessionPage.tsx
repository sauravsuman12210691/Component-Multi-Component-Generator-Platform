import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import CodeTabs from '@/components/CodeTabs';
import { sessionAPI, aiAPI, Session, ChatMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSession(id);
    }
  }, [id]);

  const loadSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionData = await sessionAPI.getSession(sessionId);
      setSession(sessionData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load session');
      if (error.response?.status === 404) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!session || !id) return;

    setIsGenerating(true);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    const updatedChatHistory = [...session.chatHistory, userMessage];
    setSession({ ...session, chatHistory: updatedChatHistory });

    try {
      // Generate code via AI
      const response = await aiAPI.generateCode({
        prompt: message,
        sessionId: id,
        existingCode: {
          jsx: session.jsx,
          css: session.css
        }
      });

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };

      const finalChatHistory = [...updatedChatHistory, aiMessage];

      // Update session with new code and chat
      const updatedSession = await sessionAPI.updateSession(id, {
        jsx: response.jsx,
        css: response.css,
        chatHistory: finalChatHistory
      });

      setSession(updatedSession);
      
      toast({
        title: "Code generated!",
        description: "Your component has been updated.",
      });
    } catch (error: any) {
      // Remove the user message if generation failed
      setSession({ ...session, chatHistory: session.chatHistory });
      
      toast({
        title: "Generation failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!id) return;

    try {
      const blob = await sessionAPI.exportSession(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${session?.name || 'session'}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: "Your session has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="h-[calc(100vh-4rem)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
            <div className="h-full border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold truncate">{session.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
              
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={60} minSize={40}>
            <CodeTabs
              jsx={session.jsx}
              css={session.css}
              onExport={handleExport}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SessionPage;