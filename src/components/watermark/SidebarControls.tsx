import React from 'react';
import { useBatchStore } from '@/store/batchStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Grid3X3, Type, Settings2 } from 'lucide-react';
export function SidebarControls() {
  const config = useBatchStore(s => s.config);
  const updateConfig = useBatchStore(s => s.updateConfig);
  const positions = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content"><Type className="w-4 h-4 mr-2" /> Content</TabsTrigger>
          <TabsTrigger value="style"><Settings2 className="w-4 h-4 mr-2" /> Style</TabsTrigger>
          <TabsTrigger value="layout"><Grid3X3 className="w-4 h-4 mr-2" /> Layout</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Watermark Text</Label>
            <Input 
              value={config.text} 
              onChange={(e) => updateConfig({ text: e.target.value })}
              placeholder="Enter watermark text..."
            />
          </div>
          <div className="space-y-4">
            <Label>Font Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div className="w-6 h-6 rounded border shadow-inner" style={{ backgroundColor: config.color }} />
                  <span className="text-sm font-mono uppercase">{config.color}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={config.color} onChange={(c) => updateConfig({ color: c })} />
              </PopoverContent>
            </Popover>
          </div>
        </TabsContent>
        <TabsContent value="style" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Opacity ({config.opacity}%)</Label>
            </div>
            <Slider 
              value={[config.opacity]} 
              onValueChange={([v]) => updateConfig({ opacity: v })} 
              max={100} 
              step={1} 
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Scale ({config.scale}%)</Label>
            </div>
            <Slider 
              value={[config.fontSize]} 
              onValueChange={([v]) => updateConfig({ fontSize: v })} 
              min={12} 
              max={200} 
              step={1} 
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Rotation ({config.rotate}°)</Label>
            </div>
            <Slider 
              value={[config.rotate]} 
              onValueChange={([v]) => updateConfig({ rotate: v })} 
              max={360} 
              step={1} 
            />
          </div>
        </TabsContent>
        <TabsContent value="layout" className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Anchor Position</Label>
            <div className="grid grid-cols-3 gap-1 max-w-[150px]">
              {positions.map((p) => (
                <button
                  key={p}
                  onClick={() => updateConfig({ position: p as any })}
                  className={cn(
                    "aspect-square border rounded flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                    config.position === p ? "bg-primary text-white border-primary" : "bg-transparent text-slate-300 border-slate-200 dark:border-slate-800"
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.position === 'tiled'} 
                onChange={(e) => updateConfig({ position: e.target.checked ? 'tiled' : 'br' })}
                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
              />
              <span className="text-sm font-medium">Enable Tiling</span>
            </label>
          </div>
          {config.position === 'tiled' && (
            <div className="space-y-4">
              <Label>Tile Gap ({config.gap}px)</Label>
              <Slider value={[config.gap]} onValueChange={([v]) => updateConfig({ gap: v })} max={500} step={10} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}