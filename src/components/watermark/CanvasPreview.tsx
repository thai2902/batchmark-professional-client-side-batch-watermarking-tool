import React, { useRef, useEffect, useState } from 'react';
import { useBatchStore } from '@/store/batchStore';
import { drawWatermark } from '@/lib/watermark-engine';
import { Loader2 } from 'lucide-react';
export function CanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeImageId = useBatchStore(s => s.activeImageId);
  const images = useBatchStore(s => s.images);
  const config = useBatchStore(s => s.config);
  const [loading, setLoading] = useState(false);
  const activeImage = images.find(img => img.id === activeImageId);
  useEffect(() => {
    if (!activeImage || !canvasRef.current) return;
    const img = new Image();
    img.src = activeImage.previewUrl;
    setLoading(true);
    img.onload = () => {
      const canvas = canvasRef.current!;
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const ratio = img.height / img.width;
      canvas.width = containerWidth;
      canvas.height = containerWidth * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawWatermark(ctx, img, config, canvas.width, canvas.height);
      }
      setLoading(false);
    };
  }, [activeImage, config]);
  if (!activeImage) return (
    <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
      <p className="text-muted-foreground">Select an image to preview watermark</p>
    </div>
  );
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 shadow-2xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-auto block" />
    </div>
  );
}