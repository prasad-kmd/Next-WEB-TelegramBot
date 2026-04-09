'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, GripVertical } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Inline Keyboard</label>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus size={14} className="mr-2" /> Add Row
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="p-3 border rounded-lg bg-gray-50 space-y-2">
            <div className="flex flex-wrap gap-2">
              {row.map((btn, btnIndex) => (
                <div key={btnIndex} className="bg-white p-2 border rounded shadow-sm w-full sm:w-[calc(50%-4px)] space-y-2 relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-100 text-red-600 border border-red-200 hidden group-hover:flex"
                    onClick={() => removeButton(rowIndex, btnIndex)}
                  >
                    <X size={12} />
                  </Button>
                  <Input
                    placeholder="Button Text"
                    value={btn.text}
                    onChange={(e) => updateButton(rowIndex, btnIndex, 'text', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="URL"
                    value={btn.url}
                    onChange={(e) => updateButton(rowIndex, btnIndex, 'url', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              ))}
              {row.length < 5 && (
                <Button variant="ghost" size="sm" className="h-auto py-2 border-dashed border-2" onClick={() => addButton(rowIndex)}>
                  <Plus size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
