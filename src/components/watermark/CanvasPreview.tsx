import React, { useRef, useEffect, useState } from 'react';
import { useBatchStore } from '@/store/batchStore';
import { drawWatermark } from '@/lib/watermark-engine';
import { Loader2, AlertCircle } from 'lucide-react';
export function CanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeImageId = useBatchStore(s => s.activeImageId);
  const images = useBatchStore(s => s.images);
  const config = useBatchStore(s => s.config);
  const [loading, setLoading] = useState(false);
  const activeImage = images.find(img => img.id === activeImageId);
  useEffect(() => {
    let isCancelled = false;
    if (!activeImage || !canvasRef.current) return;
    const render = async () => {
      setLoading(true);
      const mainImg = new Image();
      mainImg.src = activeImage.previewUrl;
      await new Promise((resolve, reject) => {
        mainImg.onload = resolve;
        mainImg.onerror = reject;
      });
      if (isCancelled) return;
      let wmImg: HTMLImageElement | null = null;
      if (config.type === 'image' && config.image) {
        wmImg = new Image();
        wmImg.src = config.image;
        await new Promise((resolve, reject) => {
          wmImg!.onload = resolve;
          wmImg!.onerror = reject;
        });
      }
      if (isCancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const ratio = mainImg.height / mainImg.width;
      canvas.width = containerWidth;
      canvas.height = containerWidth * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await drawWatermark(ctx, mainImg, config, canvas.width, canvas.height, wmImg);
      }
      if (!isCancelled) setLoading(false);
    };
    render().catch((err) => {
      console.error("Preview render failed:", err);
      if (!isCancelled) setLoading(false);
    });
    return () => {
      isCancelled = true;
    };
  }, [activeImage, config]);
  if (!activeImage) return (
    <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
      <p className="text-muted-foreground">Select an image to preview watermark</p>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 shadow-2xl ring-1 ring-white/10">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>
      {config.type === 'image' && !config.image && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-lg text-sm border border-amber-200 dark:border-amber-900">
          <AlertCircle className="w-4 h-4" />
          Please upload a logo image to see the watermark preview.
        </div>
      )}
    </div>
  );
}