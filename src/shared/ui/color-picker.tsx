'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/index';

const PRESET_COLORS = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#EAB308',
  '#84CC16',
  '#22C55E',
  '#14B8A6',
  '#06B6D4',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#A855F7',
  '#D946EF',
  '#EC4899',
  '#F43F5E',
  '#64748B',
] as const;

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
}

function ColorPicker({ value, onChange, presets = [...PRESET_COLORS] }: ColorPickerProps) {
  const [hexInput, setHexInput] = React.useState(value);

  React.useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex.toUpperCase());
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setHexInput(hex);
    onChange(hex);
  };

  const handlePresetClick = (color: string) => {
    setHexInput(color);
    onChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start gap-2 font-normal')} type="button">
          <div className="h-5 w-5 shrink-0 rounded-full border" style={{ backgroundColor: value || '#000000' }} />
          <span className="font-mono text-sm">{value || '색상 선택'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3" align="start">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={handleNativeChange}
            className="h-9 w-9 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="font-mono text-sm"
            maxLength={7}
          />
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium">프리셋 색상</p>
          <div className="grid grid-cols-8 gap-1.5">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                  value === color ? 'border-foreground ring-foreground ring-1 ring-offset-1' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                onClick={() => handlePresetClick(color)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker, PRESET_COLORS };
