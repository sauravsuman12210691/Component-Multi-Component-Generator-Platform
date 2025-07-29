import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { Plus, Calendar, Code, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { sessionAPI, Session } from '@/lib/api'; // Adjust import path

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const data = await sessionAPI.getSessions();
      setSessions(data);
    } catch {
      toast({ title: 'Error fetching sessions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      setIsCreating(true);
      const session = await sessionAPI.createSession('Untitled Session');
      toast({ title: 'Session created' });
      navigate(`/playground`);
    } catch {
      toast({ title: 'Error creating session' });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await sessionAPI.deleteSession(id);
      setSessions(prev => prev.filter(s => s._id !== id));
      toast({ title: 'Session deleted' });
    } catch {
      toast({ title: 'Failed to delete session' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <Header />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Sessions</h1>
        <Button onClick={handleCreateSession} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : sessions.length === 0 ? (
        <p className="text-muted-foreground">No sessions yet. Create your first one!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <Card key={session._id} className="group relative hover:shadow-md transition cursor-pointer">
<CardHeader
  onClick={async () => {
    try {
      await sessionAPI.updateSession(session._id, {
        // lastAccessed: new Date().toISOString(), // or any field you want to update
      });
      navigate(`/playground/${session._id}`);
    } catch (error) {
      toast({ title: 'Failed to update session' });
    }
  }}
>
                <CardTitle className="truncate text-base">{session.title || 'Untitled Session'}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(session.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between px-4 pb-4">
                <Badge variant="outline">
                  <Code className="mr-1 h-4 w-4" />
                  JSX + CSS
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(session._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
