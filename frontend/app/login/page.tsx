'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    <div className="flex min-h-screen bg-background">
      {/* Left side - Visual Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-zinc-950 overflow-hidden">
        {/* Abstract background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary shadow-sm overflow-hidden p-2">
              <Image
                src="/images/favicon/TG-post-bot-prasadm-256.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-3xl font-bold mozilla-headline tracking-tight text-white">
                PrasadM
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold google-sans">
                Telegram Bot Manager
              </p>
            </div>
          </Link>
          <div className="mt-20 space-y-6 max-w-md">
            <h2 className="text-5xl font-bold mozilla-headline text-white leading-tight">
              Manage your community with <span className="text-primary">precision</span>.
            </h2>
            <p className="text-zinc-400 google-sans text-lg leading-relaxed">
              An advanced, high-fidelity platform for scheduling and automating your Telegram content strategy. Built for mechatronics researchers and digital architects.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-500 google-sans">
                Trusted by <span className="text-white font-medium">500+</span> channel administrators worldwide.
              </p>
           </div>

           <div className="flex items-center gap-4 text-xs font-mono text-zinc-600 uppercase tracking-widest">
              <span>Next.js 16</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>Tailwind v4</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>Telegraf</span>
           </div>
        </div>
      </div>

      {/* Right side - Authentication Forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 p-1.5">
              <Image
                  src="/images/favicon/TG-post-bot-prasadm-128.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-full w-full object-contain"
              />
            </div>
            <span className="text-lg font-bold mozilla-headline">PrasadM</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20 lg:mt-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold mozilla-headline">Access Dashboard</h1>
            <p className="text-muted-foreground google-sans">Choose your preferred authentication method</p>
          </div>

          <div className="space-y-6">
            {/* Warning Banner */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-600 dark:text-amber-400 google-sans">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-bold">Notice:</span> Telegram login is temporarily unavailable due to a known Telegram server-side issue. Use email login below while we wait for a fix.
                </p>
              </div>
            </div>

            {/* Telegram Auth */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans mb-4">
                <ShieldCheck className="h-4 w-4" /> Telegram Identity
              </div>
              <div className="flex flex-col items-center justify-center py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:bg-card">
                 <TelegramLoginWidget botUsername={botUsername} onAuth={handleTelegramAuth} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans mb-1">
                    <Mail className="h-3 w-3" /> Email Address
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans">
                        <ShieldCheck className="h-3 w-3" /> Security Key
                     </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive google-sans">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Access"}
              </Button>
            </form>
          </div>

          <div className="pt-8 border-t border-border flex flex-col items-center gap-4">
             <p className="text-xs text-muted-foreground google-sans text-center">
               By authorizing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
