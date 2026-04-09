'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from '@/components/ui/badge';
import { PostTemplate } from '@/types';
import { EmptyState } from '@/components/EmptyState';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const router = useRouter();

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get('/api/templates');
      setTemplates(res.data);
    } catch (err) {
      console.error('Failed to fetch templates', err);
      toast.error('Failed to load templates', {
        action: {
          label: 'Retry',
          onClick: () => {
            window.location.reload();
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplate = async (id: string) => {
    try {
      await api.delete(`/api/templates/${id}`);
      toast.success('Template deleted');
      void fetchTemplates();
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handleLoadTemplate = (tpl: PostTemplate) => {
    localStorage.setItem('tpl_draft', JSON.stringify(tpl));
    router.push('/');
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Post Templates</h1>
            <p className="text-gray-500">Save and reuse your best post layouts</p>
          </header>

          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tpl) => (
                <ContextMenu key={tpl._id}>
                  <ContextMenuTrigger>
                    <Card className="group relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-blue-500" />
                            {tpl.name}
                          </div>
                          {tpl.media && (
                            <Badge variant="secondary" className="text-[10px]">
                              {tpl.media.file_type}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600 line-clamp-3 mb-4 min-h-[3rem]" dangerouslySetInnerHTML={{ __html: tpl.message }} />
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTemplate(tpl._id)}
                            aria-label="Delete template"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleLoadTemplate(tpl)}>
                            Load
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleLoadTemplate(tpl)}>Load Template</ContextMenuItem>
                    <ContextMenuItem className="text-red-600" onClick={() => deleteTemplate(tpl._id)}>Delete</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No templates saved"
              description="Save frequently used post layouts to speed up your workflow."
              actionLabel="Go to Composer"
              onAction={() => router.push('/')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
