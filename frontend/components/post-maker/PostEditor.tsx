'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, Code, Link as LinkIcon, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function PostEditor({ content, onChange }: Props) {
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your post message here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setCharCount(editor.getText().length);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const toolbarItems = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', label: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', label: 'Italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', label: 'Underline' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code', label: 'Code' },
    { icon: LinkIcon, action: setLink, active: 'link', label: 'Link' },
  ];

  const progressColor = charCount > 3800 ? 'bg-red-500' : charCount > 3200 ? 'bg-amber-500' : 'bg-blue-500';
  const progressWidth = Math.min((charCount / 4000) * 100, 100);

  return (
    <div className="flex flex-col rounded-lg border bg-card shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <div className="flex flex-wrap gap-1 border-b bg-muted/50 p-1">
        {toolbarItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger >
              <Toggle
                size="sm"
                pressed={editor.isActive(item.active)}
                onPressedChange={item.action}
                aria-label={item.label}
              >
                <item.icon className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 prose prose-sm max-w-none focus:outline-none dark:prose-invert"
      />
      <div className="mt-auto border-t px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex-1 mr-4 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <span>{charCount} / 4000 characters</span>
      </div>
    </div>
  );
}
