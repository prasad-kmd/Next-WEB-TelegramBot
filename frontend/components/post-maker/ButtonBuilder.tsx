'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}

interface Props {
  rows: InlineButton[][];
  onChange: (rows: InlineButton[][]) => void;
}

export default function ButtonBuilder({ rows, onChange }: Props) {
  const addButton = (rowIndex: number) => {
    const newRows = [...rows];
    newRows[rowIndex].push({ text: 'New Button', url: 'https://' });
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...rows, [{ text: 'New Button', url: 'https://' }]]);
  };

  const removeButton = (rowIndex: number, btnIndex: number) => {
    const newRows = [...rows];
    newRows[rowIndex].splice(btnIndex, 1);
    if (newRows[rowIndex].length === 0) {
      newRows.splice(rowIndex, 1);
    }
    onChange(newRows);
  };

  const updateButton = (rowIndex: number, btnIndex: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][btnIndex] = { ...newRows[rowIndex][btnIndex], [field]: value };
    onChange(newRows);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <MousePointer2 size={14} className="text-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground google-sans">Inline Keyboard API</span>
        </div>
        <Button variant="ghost" size="sm" onClick={addRow} className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
          <Plus size={12} className="mr-2" /> Add Row
        </Button>
      </div>

      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="p-4 rounded-2xl border border-border/50 bg-muted/10 space-y-4 relative group">
            <div className="flex flex-wrap gap-4">
              {row.map((btn, btnIndex) => (
                <div key={btnIndex} className="bg-card p-4 rounded-xl border border-border/50 shadow-sm w-full sm:w-[calc(50%-8px)] space-y-3 relative group/btn hover:border-primary/30 transition-all">
                  <button
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity z-10"
                    onClick={() => removeButton(rowIndex, btnIndex)}
                  >
                    <X size={12} />
                  </button>
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Label Text</label>
                     <Input
                        placeholder="Button Text"
                        value={btn.text}
                        onChange={(e) => updateButton(rowIndex, btnIndex, 'text', e.target.value)}
                        className="h-9 text-xs rounded-lg bg-muted/30 border-none font-bold google-sans"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Destination URL</label>
                     <Input
                        placeholder="URL"
                        value={btn.url}
                        onChange={(e) => updateButton(rowIndex, btnIndex, 'url', e.target.value)}
                        className="h-9 text-xs rounded-lg bg-muted/30 border-none font-mono"
                     />
                  </div>
                </div>
              ))}
              {row.length < 5 && (
                <button
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all w-full sm:w-[calc(50%-8px)] min-h-[110px]"
                  onClick={() => addButton(rowIndex)}
                >
                  <Plus size={20} className="text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add to row</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
           <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-border/50 bg-muted/5">
              <p className="text-xs text-muted-foreground google-sans italic">No interactive buttons configured.</p>
           </div>
        )}
      </div>
    </div>
  );
}
