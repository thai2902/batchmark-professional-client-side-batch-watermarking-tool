import React, { useCallback } from 'react';
import { useBatchStore } from '@/store/batchStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Grid3X3, Type, Settings2, Image as ImageIcon, X, HelpCircle, UploadCloud } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function SidebarControls() {
  const config = useBatchStore(s => s.config);
  const updateConfig = useBatchStore(s => s.updateConfig);
  const clearWatermarkImage = useBatchStore(s => s.clearWatermarkImage);
  const positions = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateConfig({ image: dataUrl });
    };
    reader.readAsDataURL(file);
  }, [updateConfig]);
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="space-y-4">
        <Label className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Watermark Type</Label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <button
            onClick={() => updateConfig({ type: 'text' })}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              config.type === 'text' ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Type className="w-4 h-4" /> Text
          </button>
          <button
            onClick={() => updateConfig({ type: 'image' })}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              config.type === 'image' ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ImageIcon className="w-4 h-4" /> Image
          </button>
        </div>
      </div>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-6 pt-4">
          {config.type === 'text' ? (
            <>
              <div className="space-y-2">
                <Label>Watermark Text</Label>
                <Input
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  placeholder="e.g. © 2024 Your Name"
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
            </>
          ) : (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Logo Image
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>Transparent PNGs work best for logos</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              {config.image ? (
                <div className="relative group aspect-video rounded-lg border bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                  <img src={config.image} alt="Logo preview" className="max-h-full object-contain" />
                  <button
                    onClick={clearWatermarkImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload PNG/JPG Logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="style" className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Opacity ({config.opacity}%)</Label>
            <Slider value={[config.opacity]} onValueChange={([v]) => updateConfig({ opacity: v })} max={100} step={1} />
          </div>
          <div className="space-y-4">
            <Label>{config.type === 'text' ? 'Font Size' : 'Watermark Size'} ({config.type === 'text' ? config.fontSize : config.scale}%)</Label>
            <Slider
              value={[config.type === 'text' ? config.fontSize : config.scale]}
              onValueChange={([v]) => config.type === 'text' ? updateConfig({ fontSize: v }) : updateConfig({ scale: v })}
              min={config.type === 'text' ? 12 : 5}
              max={config.type === 'text' ? 200 : 100}
              step={1}
            />
          </div>
          <div className="space-y-4">
            <Label>Rotation ({config.rotate}°)</Label>
            <Slider value={[config.rotate]} onValueChange={([v]) => updateConfig({ rotate: v })} max={360} step={1} />
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
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={cn(
                "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                config.position === 'tiled' ? "bg-primary border-primary" : "bg-transparent border-slate-300 group-hover:border-slate-400"
              )}>
                {config.position === 'tiled' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={config.position === 'tiled'}
                onChange={(e) => updateConfig({ position: e.target.checked ? 'tiled' : 'br' })}
              />
              <span className="text-sm font-medium">Enable Tiling</span>
            </label>
          </div>
          {config.position === 'tiled' && (
            <div className="space-y-4 pt-2">
              <Label>Tile Gap ({config.gap}px)</Label>
              <Slider value={[config.gap]} onValueChange={([v]) => updateConfig({ gap: v })} max={500} step={10} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}