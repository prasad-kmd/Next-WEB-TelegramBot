'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PageLayout } from '@/components/layout/PageLayout';

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
    <PageLayout>
      <header className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mozilla-headline">Post Templates</h1>
          <p className="text-muted-foreground google-sans">Save and reuse your best post layouts</p>
        </div>
        <Button onClick={() => window.location.href = '/'} className="rounded-xl font-bold uppercase tracking-widest text-xs h-10 px-6">
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <ContextMenu key={tpl._id}>
            <ContextMenuTrigger>
              <Card className="group relative flex flex-col h-full rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 cursor-default overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 truncate mozilla-headline">
                      <FileText size={18} className="text-primary shrink-0" />
                      <span className="truncate">{tpl.name}</span>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border/50 bg-card/90 backdrop-blur-md">
                        <DropdownMenuItem onClick={() => {}} className="google-sans font-medium">
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive font-medium google-sans" onClick={() => deleteTemplate(tpl._id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {tpl.media && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="gap-1 font-bold uppercase tracking-tighter text-[9px] bg-primary/10 text-primary border-none">
                        {tpl.media.file_type === 'photo' ? <ImageIcon size={10} /> : <Video size={10} />}
                        {tpl.media.file_type}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div
                    className="text-sm text-foreground/70 line-clamp-4 prose prose-sm dark:prose-invert google-sans"
                    dangerouslySetInnerHTML={{ __html: tpl.message }}
                  />
                </CardContent>
                <div className="p-4 pt-0 mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button size="sm" variant="outline" className="w-full rounded-lg font-bold uppercase tracking-widest text-[10px]">
                    Load
                  </Button>
                  <Button size="sm" variant="ghost" className="px-2 rounded-lg" onClick={() => deleteTemplate(tpl._id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent className="rounded-xl border-border/50 bg-card/90 backdrop-blur-md">
              <ContextMenuItem onClick={() => {}} className="google-sans font-medium">Load Template</ContextMenuItem>
              <ContextMenuItem onClick={() => {}} className="google-sans font-medium">Duplicate</ContextMenuItem>
              <ContextMenuItem className="text-destructive google-sans font-medium" onClick={() => deleteTemplate(tpl._id)}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {!loading && templates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-card/30 border border-dashed border-border/50 rounded-2xl text-muted-foreground animate-in zoom-in-95 duration-500">
          <FileText size={48} className="mb-4 opacity-10" />
          <p className="text-xl font-bold mozilla-headline text-foreground">No templates saved</p>
          <p className="text-sm google-sans mb-8">Save posts as templates to reuse them later.</p>
          <Button className="rounded-xl font-bold uppercase tracking-widest text-xs px-8 h-12 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/'}>
            Go to Composer
          </Button>
        </div>
      )}
    </PageLayout>
  );
}
