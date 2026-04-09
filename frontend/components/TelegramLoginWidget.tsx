'use strict';

import React, { useEffect, useRef } from 'react';
import { TelegramUser } from '@/types';

interface Props {
  botUsername: string;
  onAuth: (user: TelegramUser) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: string;
  usePic?: boolean;
}

const TelegramLoginWidget: React.FC<Props> = ({
  botUsername,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = 'write',
  usePic = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.appendChild(script);
    }

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [botUsername, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

  return <div ref={containerRef} />;
};

export default TelegramLoginWidget;
