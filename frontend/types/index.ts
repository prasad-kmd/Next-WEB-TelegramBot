export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface Media {
  file_id: string;
  file_type: string;
  file_name?: string;
  thumb_file_id?: string;
}

export interface InlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface PostTemplate {
  _id: string;
  name: string;
  message: string;
  replyMarkup?: {
    inline_keyboard: InlineButton[][];
  };
  media?: Media;
  settings?: {
    silentSend?: boolean;
    pinMessage?: boolean;
  };
}

export interface ScheduledPost {
  _id: string;
  targets: string[];
  message: string;
  status: 'pending' | 'sent' | 'failed';
  scheduledAt: string;
  media?: Media;
}

export interface Channel {
  _id: string;
  channelId: string;
  channelTitle: string;
}
