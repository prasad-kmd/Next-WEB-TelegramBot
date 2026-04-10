'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import { Spoiler } from '@/lib/tiptap-extensions/Spoiler';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Link as LinkIcon,
  Quote,
  Strikethrough,
  EyeOff,
  Terminal,
  Type,
  FileCode,
  Eye,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  onChange: (html: string) => void;
  charLimit?: number;
}

export default function PostEditor({ content, onChange, charLimit = 4096 }: Props) {
  const [charCount, setCharCount] = useState(0);
  const [view, setView] = useState<'visual' | 'raw'>('visual');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        blockquote: false,
        strike: false,
      }),
      Underline,
      Strike,
      Blockquote,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'tg-code-block',
        },
      }),
      Spoiler,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tg-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Compose your Telegram message...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setCharCount(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[250px] p-6 prose prose-sm max-w-none dark:prose-invert google-sans text-lg leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toolbarItems = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', label: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', label: 'Italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', label: 'Underline' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', label: 'Strikethrough' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote', label: 'Quote' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code', label: 'Monospace' },
    { icon: FileCode, action: () => editor.chain().focus().toggleCodeBlock().run(), active: 'codeBlock', label: 'Code Block' },
    { icon: EyeOff, action: () => editor.chain().focus().toggleMark('spoiler').run(), active: 'spoiler', label: 'Spoiler' },
    { icon: LinkIcon, action: setLink, active: 'link', label: 'Link' },
  ];

  const progressColor = charCount > charLimit * 0.95 ? 'bg-destructive' : charCount > charLimit * 0.8 ? 'bg-amber-500' : 'bg-primary';
  const progressWidth = Math.min((charCount / charLimit) * 100, 100);

  return (
    <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden group transition-all focus-within:border-primary/50">
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-2">
          <TabsList className="bg-muted/50 p-1 h-9 rounded-lg">
            <TabsTrigger value="visual" className="text-[10px] font-bold uppercase tracking-widest px-4 rounded-md data-[state=active]:bg-background">Preview</TabsTrigger>
            <TabsTrigger value="raw" className="text-[10px] font-bold uppercase tracking-widest px-4 rounded-md data-[state=active]:bg-background">Raw View</TabsTrigger>
          </TabsList>

          {view === 'visual' && (
            <div className="flex items-center gap-1">
              {toolbarItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger>
                    <Toggle
                      size="sm"
                      pressed={editor.isActive(item.active)}
                      onPressedChange={item.action}
                      className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    >
                      <item.icon className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-bold">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="visual" className="mt-0 outline-none">
          <EditorContent editor={editor} />
        </TabsContent>

        <TabsContent value="raw" className="mt-0 outline-none">
          <textarea
            className="w-full min-h-[250px] p-6 font-mono text-sm bg-zinc-950 text-zinc-300 focus:outline-none resize-none"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-auto border-t border-border/50 px-6 py-3 flex items-center justify-between bg-muted/10">
        <div className="flex flex-col gap-1 flex-1 mr-8">
           <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground google-sans">
              <span>Memory Usage</span>
              <span className={cn(charCount > charLimit ? "text-destructive" : "")}>
                {charCount} / {charLimit} CHARS
              </span>
           </div>
           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
             <div
               className={cn("h-full transition-all duration-500 ease-out rounded-full", progressColor)}
               style={{ width: `${progressWidth}%` }}
             />
           </div>
        </div>

        <div className="flex items-center gap-4">
           {charCount > charLimit && (
             <div className="flex items-center gap-2 text-destructive animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Limit Exceeded</span>
             </div>
           )}
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary">
              <Hash className="h-3 w-3" />
              <span className="text-[10px] font-bold font-mono">{charCount}</span>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .tg-spoiler {
          background-color: currentColor;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .tg-spoiler:hover {
          background-color: color-mix(in srgb, currentColor, transparent 80%);
        }
        .tg-code {
          background-color: color-mix(in srgb, var(--primary), transparent 90%);
          color: var(--primary);
          padding: 0.2em 0.4em;
          border-radius: 6px;
          font-family: var(--font-jetbrains);
          font-size: 0.9em;
        }
        .tg-code-block {
          background-color: #18181b;
          color: #e4e4e7;
          padding: 1.5rem;
          border-radius: 12px;
          font-family: var(--font-jetbrains);
          font-size: 0.85em;
          margin: 1rem 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .tg-link {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 500;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

import { AlertCircle } from 'lucide-react';
