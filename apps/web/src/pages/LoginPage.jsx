
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      toast.success(`Welcome back, ${user.name}`);
      
      if (user.role === 'Manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Future Designz Portal</title>
        <meta name="description" content="Login to access your employee performance dashboard" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <img 
                src="https://horizons-cdn.hostinger.com/945a9ac3-86d1-4391-91a3-db16b6b4c9d0/a85c19b66da0797edd274fe698bfc0b0.png" 
                alt="Future Designz Logo" 
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    required
                    className="text-foreground bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                    className="text-foreground bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition-all duration-200 active:scale-[0.98] mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                <p className="text-sm font-medium text-foreground mb-2">Demo accounts:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Manager: manager@company.com / Manager123!</p>
                  <p>Employee: alice.smith@company.com / Employee123!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
