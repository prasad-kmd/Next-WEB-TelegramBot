'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTelegramAuth = async (user: any) => {
    try {
      await api.post('/auth/telegram', user);
      router.push('/');
    } catch (err) {
      console.error('Auth failed', err);
      alert('Login failed. Are you an authorized user?');
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'YourBotUsername';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12 text-white">
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold">Telegram Post Maker</h1>
          <p className="text-lg opacity-90">
            Create, preview, and schedule high-quality Telegram posts with ease.
            Manage multiple channels and use AI to improve your content.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Telegram Login Section */}
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-amber-800">
                  ⚠️ Telegram login is temporarily unavailable due to a known Telegram server-side issue.
                  Use email login below while we wait for a fix.
                </p>
              </div>
              <div className="flex justify-center">
                <TelegramLoginWidget botUsername={botUsername} onAuth={handleTelegramAuth} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or sign in with email</span>
              </div>
            </div>

            {/* Credentials Login Form */}
            <form onSubmit={handleCredentialsAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
