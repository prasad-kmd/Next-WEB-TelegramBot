'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function TelegramLinkBanner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLinked, setIsLinked] = useState<boolean | null>(null);
  const [linkedUsername, setLinkedUsername] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkLinkStatus();
    }
  }, [session]);

  useEffect(() => {
    if (searchParams.get('link') === 'true' && isLinked === false) {
      setIsDialogOpen(true);
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('link');
      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : '/');
    }
  }, [searchParams, isLinked, router]);

  const checkLinkStatus = async () => {
    try {
      const res = await api.get('/auth/tg-link-info', {
        headers: { 'x-user-email': session?.user?.email }
      });
      if (res.data.telegramId) {
        setIsLinked(true);
        setLinkedUsername(res.data.username || res.data.telegramId);
      } else {
        setIsLinked(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequest = async () => {
    if (!identifier) return;
    setLoading(true);
    try {
      await api.post('/auth/tg-link-request', {
        telegramIdentifier: identifier,
        email: session?.user?.email
      });
      setStep('verify');
      setCountdown(300);
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);
      toast.success('Confirmation code sent to Telegram');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    try {
      await api.post('/auth/tg-verify', {
        code,
        email: session?.user?.email
      });
      setIsLinked(true);
      setIsDialogOpen(false);
      checkLinkStatus();
      toast.success('Telegram account linked successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    if (step === 'verify' && isDialogOpen) {
      pollTimer = setInterval(async () => {
        try {
          const res = await api.get('/auth/tg-link-status', {
            headers: { 'x-user-email': session?.user?.email }
          });
          if (res.data.confirmed) {
            setIsLinked(true);
            setIsDialogOpen(false);
            checkLinkStatus();
            toast.success('Telegram account linked via bot!');
            clearInterval(pollTimer);
          }
        } catch (e) {}
      }, 3000);
    }
    return () => clearInterval(pollTimer);
  }, [step, isDialogOpen, session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLinked === null || isLinked) {
    if (isLinked && linkedUsername) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 mb-6">
          <CheckCircle2 size={16} />
          <span>✅ Linked to Telegram: <span className="font-semibold">{linkedUsername.startsWith('@') ? '' : '@'}{linkedUsername}</span></span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 mb-6 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <Link2 className="h-4 w-4 shrink-0" />
          <p>🔗 Link your Telegram account to enable posting</p>
        </div>
        <Button size="sm" variant="outline" className="border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900" onClick={() => setIsDialogOpen(true)}>
          Link Now
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{step === 'input' ? 'Link Telegram Account' : 'Verify Code'}</DialogTitle>
            <DialogDescription>
              {step === 'input'
                ? 'Enter your Telegram username (e.g. @yourusername) or numeric User ID'
                : 'A confirmation message was sent to your Telegram. Enter the 6-digit code or tap Confirm in Telegram.'}
            </DialogDescription>
          </DialogHeader>

          {step === 'input' ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Telegram Username or ID</Label>
                <Input
                  id="identifier"
                  placeholder="@username or 12345678"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRequest()}
                />
              </div>
              <Button className="w-full" onClick={handleRequest} disabled={loading || !identifier}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Confirmation
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-center">
                <Label htmlFor="code" className="text-sm font-medium">6-Digit Code</Label>
                <Input
                  id="code"
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Expires in {formatTime(countdown)}
                </p>
              </div>
              <Button className="w-full" onClick={handleVerify} disabled={loading || code.length !== 6 || countdown === 0}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
              </Button>
              {canResend && (
                <Button variant="link" className="w-full text-xs" onClick={() => setStep('input')}>
                  Didn&apos;t get a code? Try again
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
