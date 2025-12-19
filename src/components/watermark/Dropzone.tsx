import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useBatchStore } from '@/store/batchStore';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Dropzone() {
  const addImages = useBatchStore(s => s.addImages);
  const imagesCount = useBatchStore(s => s.images.length);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    addImages(acceptedFiles);
  }, [addImages]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        imagesCount === 0 ? "h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50" : "h-32 border border-dashed rounded-lg flex items-center justify-center",
        isDragActive ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
          {imagesCount === 0 ? <UploadCloud className="w-10 h-10" /> : <ImageIcon className="w-6 h-6" />}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {isDragActive ? "Drop images here" : imagesCount === 0 ? "Click or drag images to watermark" : "Add more images"}
          </p>
          {imagesCount === 0 && <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP</p>}
        </div>
      </div>
    </div>
  );
}