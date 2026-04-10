'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTelegramAuth = async (user: any) => {
    try {
      await api.post('/auth/telegram', user);
      router.push('/');
    } catch (err) {
      console.error('Auth failed', err);
      setError('Telegram login failed. Are you an authorized user?');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left Panel - Branding */}
        <div className="relative hidden flex-col justify-between bg-zinc-900 p-10 text-white md:flex overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/images/hero/blackhole.webp"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xl font-bold font-heading">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Image
                  src="/images/favicon/TG-post-bot-prasadm-32.webp"
                  alt="Logo"
                  width={24}
                  height={24}
                />
              </div>
              Post Maker Bot
            </div>
            <p className="mt-4 text-zinc-400 font-body">
              Compose, schedule and manage your Telegram posts with ease.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
            <blockquote className="space-y-2">
              <p className="text-lg font-body">
                "This tool has completely changed how I manage my Telegram channels. Scheduling is a breeze!"
              </p>
              <footer className="text-sm text-zinc-500">— Alex, Content Manager</footer>
            </blockquote>
            
            {/* Hero Images Showcase */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/hero/diary.webp"
                  alt="Diary"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/hero/workflow.webp"
                  alt="Workflow"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/hero/posts.webp"
                  alt="Posts"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Forms */}
        <div className="p-8 md:p-12">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight font-heading">Welcome back</h1>
              <p className="text-sm text-muted-foreground font-body">
                Sign in to your account to continue
              </p>
            </div>

            {/* Telegram Section */}
            <div className="grid gap-6">
              <div className="flex flex-col items-center justify-center py-4">
                <TelegramLoginWidget botUsername={botUsername} onAuth={handleTelegramAuth} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                    ── or sign in with email ──
                  </span>
                </div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
