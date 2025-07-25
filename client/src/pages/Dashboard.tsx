import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { sessionAPI, Session } from '@/lib/api';
import { Plus, Calendar, Clock, Code, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionAPI.getSessions();
      setSessions(data);
    } catch (error) {
      toast({
        title: "Failed to load sessions",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    setIsCreating(true);
    try {
      const newSession = await sessionAPI.createSession();
      navigate(`/session/${newSession._id}`);
    } catch (error) {
      toast({
        title: "Failed to create session",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await sessionAPI.deleteSession(sessionId);
      setSessions(sessions.filter(s => s._id !== sessionId));
      toast({
        title: "Session deleted",
        description: "The session has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete session",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Sessions</h1>
            <p className="text-muted-foreground">
              Manage and continue your component generation sessions
            </p>
          </div>
          <Button
            onClick={createNewSession}
            disabled={isCreating}
            variant="gradient"
            className="shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? "Creating..." : "New Session"}
          </Button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mx-auto mb-6 shadow-glow">
              <Code className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No sessions yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first session to begin generating beautiful React components with AI.
            </p>
            <Button
              onClick={createNewSession}
              disabled={isCreating}
              variant="gradient"
              size="lg"
              className="shadow-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Session
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card
                key={session._id}
                className="group hover:shadow-subtle transition-all cursor-pointer border-border/50 hover:border-primary/20"
                onClick={() => navigate(`/session/${session._id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-smooth">
                        {session.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.createdAt)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated {formatDate(session.updatedAt)}
                    </div>
                    
                    {Array.isArray(session.chatHistory) && session.chatHistory.length > 0 && (
  <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
    <p className="text-xs text-muted-foreground mb-1">Latest:</p>
    <p className="text-sm line-clamp-2">
      {session.chatHistory[session.chatHistory.length - 1]?.content || "No messages yet"}
    </p>
  </div>
)}

                    
                    <div className="flex items-center gap-2">
                      <Badge variant={session.jsx ? "default" : "secondary"} className="text-xs">
                        {session.jsx ? "Has JSX" : "No JSX"}
                      </Badge>
                      <Badge variant={session.css ? "default" : "secondary"} className="text-xs">
                        {session.css ? "Has CSS" : "No CSS"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;