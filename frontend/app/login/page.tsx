'use client';

import { useRouter } from 'next/navigation';
import TelegramLoginWidget from '@/components/TelegramLoginWidget';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();

  const handleAuth = async (user: any) => {
    try {
      await api.post('/auth/telegram', user);
      router.push('/');
    } catch (err) {
      console.error('Auth failed', err);
      alert('Login failed. Are you an authorized user?');
    }
  };

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'YourBotUsername';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Post Maker Bot</CardTitle>
          <CardDescription>Sign in with Telegram to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <TelegramLoginWidget botUsername={botUsername} onAuth={handleAuth} />
        </CardContent>
      </Card>
    </div>
  );
}
