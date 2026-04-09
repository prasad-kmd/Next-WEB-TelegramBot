'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/api/templates');
      setTemplates(res.data);
    } catch (err) {
      console.error('Failed to fetch templates');
    }
  };

  const deleteTemplate = async (id: string) => {
    await api.delete(`/api/templates/${id}`);
    fetchTemplates();
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" />
                    {tpl.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: tpl.message }} />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => deleteTemplate(tpl._id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-20 bg-white border rounded-xl text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>No templates saved yet.</p>
              <Button variant="link" className="mt-2" onClick={() => window.location.href = '/'}>
                Go to Composer
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
