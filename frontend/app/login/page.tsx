'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-card border shadow-2xl md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left Panel - Branding */}
        <div className="relative hidden flex-col justify-between p-10 text-white md:flex overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/posts.webp"
              alt="Background"
              fill
              className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 to-zinc-900/60" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 text-2xl font-mozilla-headline font-bold">
              <Image src="/images/favicon/TG-post-bot-prasadm-32.png" alt="Logo" width={40} height={40} className="h-10 w-10" />
              Telegram Post Maker
            </div>
            <p className="mt-6 text-lg font-mozilla-text text-zinc-300 leading-relaxed">
              Elevate your Telegram presence with precision scheduling and visual composition.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <blockquote className="space-y-2 border-l-4 border-primary pl-4">
              <p className="text-lg font-mozilla-text italic">
                "The ultimate tool for managing my broadcasting channels. Efficiency at its finest."
              </p>
              <footer className="text-sm font-google-sans text-zinc-400">— PRASADM, Lead Developer</footer>
            </blockquote>

            <div className="flex flex-wrap gap-4 text-xs font-google-sans text-zinc-500">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Forms */}
        <div className="p-8 md:p-12 bg-card">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Telegram Section */}
            <div className="grid gap-6">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    <span className="font-semibold">Notice:</span> Telegram login is temporarily unavailable due to a known Telegram server-side issue. Use email login below while we wait for a fix.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <TelegramLoginWidget botUsername={botUsername} onAuth={handleTelegramAuth} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-google-sans">
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
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
