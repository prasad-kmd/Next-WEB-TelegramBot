'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-web-app.js'
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleTelegramLogin = (user: any) => {
    // Send user data to backend for verification
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
        auth_date: user.auth_date,
        hash: user.hash,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        console.error('Login failed:', err)
      })
  }

  useEffect(() => {
    // Load Telegram login widget
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-web-app.js'
    script.async = true
    document.body.appendChild(script)

    const loginScript = document.createElement('script')
    loginScript.innerHTML = `
      window.onTelegramAuth = function(user) {
        window.telegramUser = user;
      }
    `
    document.body.appendChild(loginScript)

    return () => {
      document.body.removeChild(script)
      document.body.removeChild(loginScript)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Telegram Post Maker
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and schedule rich Telegram posts
            </p>
          </div>

          <div className="space-y-4">
            <div
              className="telegram-login"
              data-telegram-login={botUsername}
              data-size="large"
              data-onauth="onTelegramAuth(user)"
              data-request-access="write"
            />

            <script
              async
              src="https://telegram.org/js/telegram-widget.js?15"
              onLoad={() => {
                if (typeof window !== 'undefined') {
                  // Telegram widget will initialize automatically
                }
              }}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            By logging in, you agree to use this bot responsibly
          </p>
        </div>
      </Card>
    </div>
  )
}
