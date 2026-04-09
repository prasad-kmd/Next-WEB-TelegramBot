'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function TelegramLinkBanner() {
  const { data: session } = useSession();
  const [isLinked, setIsLinked] = useState(false);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (session?.user?.email) {
      checkLinkStatus();
    }
  }, [session]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkLinkStatus = async () => {
    try {
      const res = await api.get(`/api/auth/tg-link-status?email=${session?.user?.email}`);
      setIsLinked(res.data.confirmed);
      setTelegramId(res.data.telegramId);
    } catch (err) {
      console.error('Failed to check link status');
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/tg-link-request', {
        telegramIdentifier: identifier,
        email: session?.user?.email
      });
      setStep('verify');
      setCountdown(300); // 5 minutes
      toast.success('Confirmation code sent to your Telegram!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/tg-verify', {
        code,
        email: session?.user?.email
      });
      toast.success('Telegram account linked successfully!');
      setIsLinked(true);
      setIsDialogOpen(false);
      checkLinkStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Polling for confirmation via inline button
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    if (isDialogOpen && step === 'verify' && !isLinked) {
      pollTimer = setInterval(async () => {
        try {
          const res = await api.get(`/api/auth/tg-link-status?email=${session?.user?.email}`);
          if (res.data.confirmed) {
            setIsLinked(true);
            setIsDialogOpen(false);
            toast.success('Telegram account linked successfully!');
            clearInterval(pollTimer);
          }
        } catch (err) {}
      }, 3000);
    }
    return () => clearInterval(pollTimer);
  }, [isDialogOpen, step, isLinked, session]);

  if (!session) return null;
  if (isLinked) return (
    <div className="bg-green-50 border-b border-green-100 px-8 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
        <CheckCircle2 size={16} />
        <span>✅ Linked to Telegram ID: {telegramId}</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-blue-50 border-b border-blue-100 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-blue-800 text-sm font-medium">
          <Link2 size={18} />
          <span>🔗 Link your Telegram account to enable posting</span>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Link Now
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{step === 'request' ? 'Link Telegram Account' : 'Verify Confirmation'}</DialogTitle>
            <DialogDescription>
              {step === 'request'
                ? 'Enter your Telegram username (e.g. @yourusername) or numeric User ID'
                : 'A confirmation message was sent to your Telegram. Enter the 6-digit code or tap Confirm in Telegram.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {step === 'request' ? (
              <div className="space-y-4">
                <Input
                  placeholder="@username or 12345678"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <Button className="w-full" onClick={handleSendRequest} disabled={loading || !identifier}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Confirmation
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <Input
                  className="text-center text-2xl tracking-widest font-bold"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                />
                <div className="text-sm text-muted-foreground">
                  Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </div>
                <Button className="w-full" onClick={handleVerifyCode} disabled={loading || code.length !== 6 || countdown === 0}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Code
                </Button>
                {countdown < 240 && (
                  <Button variant="ghost" size="sm" onClick={() => setStep('request')}>
                    Resend Code
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
