import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/auth';
import { Code, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();                // Prevent default form behavior
  setIsLoading(true);               // Show loading indicator

  try {
    await login(email, password);   // Perform login API call
    console.log("hiii")
    navigate("/dashboard")
    console.log("hiii222222")

    toast({
      title: "Welcome back!",
      description: "You've been successfully logged in.",
    });
          // Redirect to dashboard on success
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.response?.data?.message || "Invalid credentials",
      variant: "destructive",       // Show error message on failure
    });
  } finally {
    setIsLoading(false);           // Always turn off loading state
  }
};

  const handleGoogleLogin = () => {
    window.location.href = authAPI.getGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(/src/assets/hero-bg.jpg)` }}
      />
      <div className="absolute inset-0 gradient-surface opacity-80" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 shadow-glow">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue generating components
          </p>
        </div>

        <Card className="shadow-subtle border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full transition-smooth hover:shadow-subtle"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 transition-smooth underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;