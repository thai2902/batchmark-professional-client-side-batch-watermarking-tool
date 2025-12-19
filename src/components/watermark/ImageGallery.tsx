import React from 'react';
import { useBatchStore } from '@/store/batchStore';
import { BatchImage } from '@/types';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
export function ImageGallery() {
  const images = useBatchStore(s => s.images);
  const activeImageId = useBatchStore(s => s.activeImageId);
  const setActiveImage = useBatchStore(s => s.setActiveImage);
  const removeImage = useBatchStore(s => s.removeImage);
  if (images.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Queue ({images.length})</h3>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-3">
          {images.map((img: BatchImage) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img.id)}
              className={cn(
                "group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-slate-100 dark:bg-slate-900",
                activeImageId === img.id ? "border-primary shadow-lg scale-[0.98]" : "border-transparent"
              )}
            >
              <img src={img.previewUrl} alt="thumbnail" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/40 text-[10px] text-white truncate px-2">
                {img.file.name}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}