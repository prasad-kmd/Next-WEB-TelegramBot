'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Trash2,
  Copy,
  MoreVertical,
  Plus,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/templates');
      setTemplates(res.data);
    } catch (err) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await api.delete(`/api/templates/${id}`);
      setTemplates(prev => prev.filter(t => t._id !== id));
      toast.success('Template deleted');
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <AppLayout>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mozilla-headline">Post Templates</h1>
          <p className="text-muted-foreground font-mozilla-text">Save and reuse your best post layouts</p>
        </div>
        <Button onClick={() => window.location.href = '/'} className="font-google-sans">
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <ContextMenu key={tpl._id}>
            <ContextMenuTrigger>
              <Card className="group relative flex flex-col h-full hover:border-primary/50 transition-all duration-300 cursor-default">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 truncate font-google-sans">
                      <FileText size={18} className="text-blue-500 shrink-0" />
                      <span className="truncate">{tpl.name}</span>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteTemplate(tpl._id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {tpl.media && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="gap-1 font-normal font-jetbrains-mono">
                        {tpl.media.file_type === 'photo' ? <ImageIcon size={10} /> : <Video size={10} />}
                        {tpl.media.file_type}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div
                    className="text-sm text-muted-foreground line-clamp-4 prose prose-sm dark:prose-invert font-google-sans"
                    dangerouslySetInnerHTML={{ __html: tpl.message }}
                  />
                </CardContent>
                <div className="p-4 pt-0 mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button size="sm" variant="outline" className="w-full font-google-sans">
                    Load
                  </Button>
                  <Button size="sm" variant="ghost" className="px-2" onClick={() => deleteTemplate(tpl._id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => {}}>Load Template</ContextMenuItem>
              <ContextMenuItem onClick={() => {}}>Duplicate</ContextMenuItem>
              <ContextMenuItem className="text-red-600" onClick={() => deleteTemplate(tpl._id)}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {!loading && templates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed rounded-xl text-muted-foreground">
          <FileText size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium font-google-sans">No templates saved yet.</p>
          <p className="text-sm mb-6 font-google-sans">Create a post and save it as a template to see it here.</p>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="font-google-sans">
            Go to Composer
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
