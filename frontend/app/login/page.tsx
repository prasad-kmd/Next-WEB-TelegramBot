'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTelegramAuth = async (user: any) => {
    try {
      setLoading(true);
      await api.post('/auth/telegram', user);
      router.push('/');
    } catch (err) {
      console.error('Auth failed', err);
      setError('Telegram login failed. Are you an authorized user?');
      setLoading(false);
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

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-google-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/posts.webp"
          alt="Premium Background"
          fill
          className="object-cover opacity-40 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] mx-4">

        {/* Left Branding Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group overflow-hidden">
                <Image src="/images/favicon/TG-post-bot-prasadm-32.png" alt="Logo" width={32} height={32} className="z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-mozilla-headline font-bold text-white tracking-tight">Telegram Post Maker</span>
            </motion.div>

            <div className="mt-16 space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-mozilla-headline font-bold text-white leading-tight"
              >
                The Future of <br />
                <span className="text-primary">Telegram Post</span> Management.
              </motion.h2>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, text: "Enterprise-grade security & encryption", color: "text-green-400" },
                  { icon: Zap, text: "Instant scheduling & real-time analytics", color: "text-amber-400" },
                  { icon: Globe, text: "Multi-channel support & global reach", color: "text-blue-400" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-3 text-white/60 font-google-sans text-sm"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex gap-4 text-xs font-google-sans text-white/40">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
             </div>
             <p className="text-xs text-white/20 font-jetbrains-mono uppercase tracking-[0.2em]">Designed for Performance</p>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mx-auto space-y-8"
          >
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-3xl font-mozilla-headline font-bold text-white">Sign In</h3>
              <p className="text-white/50 font-google-sans text-sm">Access your workspace and manage your broadcasts.</p>
            </div>

            <div className="grid gap-6">
              {/* Telegram Login */}
              <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-primary/50 transition-all duration-500">
                <p className="text-xs font-jetbrains-mono text-white/40 mb-4 uppercase tracking-widest">Secure Telegram Access</p>
                <TelegramLoginWidget botUsername={botUsername} onAuth={handleTelegramAuth} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-jetbrains-mono">
                  <span className="bg-[#0c0c0c] px-4 text-white/30">
                    Alternative Login
                  </span>
                </div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-xs text-white/60 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary rounded-xl transition-all font-google-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 group">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" title="password" className="text-xs text-white/60">Password</Label>
                    <button type="button" className="text-[10px] text-primary/70 hover:text-primary font-jetbrains-mono">FORGOT?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary rounded-xl transition-all font-google-sans pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 font-google-sans"
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 group shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Enter Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer info for mobile */}
      <div className="lg:hidden absolute bottom-8 w-full px-8 flex justify-center gap-6 text-[10px] font-google-sans text-white/40 uppercase tracking-widest">
         <Link href="/privacy" className="hover:text-white">Privacy</Link>
         <Link href="/terms" className="hover:text-white">Terms</Link>
         <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
      </div>
    </div>
  );
}
