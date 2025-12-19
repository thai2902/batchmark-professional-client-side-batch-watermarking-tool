import React, { useState } from 'react';
import { useBatchStore } from '@/store/batchStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dropzone } from '@/components/watermark/Dropzone';
import { ImageGallery } from '@/components/watermark/ImageGallery';
import { CanvasPreview } from '@/components/watermark/CanvasPreview';
import { SidebarControls } from '@/components/watermark/SidebarControls';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, LayoutDashboard, Layers, Info, Trash2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast, Toaster } from 'sonner';
export function HomePage() {
  const images = useBatchStore(s => s.images);
  const config = useBatchStore(s => s.config);
  const isProcessing = useBatchStore(s => s.isProcessing);
  const progress = useBatchStore(s => s.progress);
  const setProcessing = useBatchStore(s => s.setProcessing);
  const setProgress = useBatchStore(s => s.setProgress);
  const clearImages = useBatchStore(s => s.clearImages);
  const handleProcessBatch = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setProgress(0);
    try {
      const worker = new Worker(new URL('../workers/processor.worker.ts', import.meta.url), { type: 'module' });
      worker.postMessage({ 
        images: images.map(img => ({ file: img.file, id: img.id })), 
        config 
      });
      worker.onmessage = (e) => {
        if (e.data.type === 'progress') {
          setProgress(e.data.value);
        } else if (e.data.type === 'complete') {
          saveAs(e.data.blob, 'batchmark-export.zip');
          setProcessing(false);
          toast.success('Process complete! Downloading ZIP...');
          worker.terminate();
        }
      };
    } catch (err) {
      console.error(err);
      toast.error('Failed to process images');
      setProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col">
      <header className="h-16 border-b bg-white dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">BatchMark</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle className="relative top-0 right-0" />
          <Button 
            onClick={handleProcessBatch} 
            disabled={images.length === 0 || isProcessing}
            className="shadow-primary font-bold px-6"
          >
            {isProcessing ? `Processing ${progress}%` : "Process Batch"}
            {!isProcessing && <Download className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Gallery & Dropzone Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            <Dropzone />
            {images.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="sticky top-24">
                    <div className="flex justify-between items-center mb-4">
                       <h2 className="text-sm font-bold flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> BATCH QUEUE</h2>
                       <Button variant="ghost" size="sm" onClick={clearImages} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                    <ImageGallery />
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="text-sm font-bold flex items-center gap-2"><Info className="w-4 h-4" /> PREVIEW</h2>
                  <CanvasPreview />
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs text-muted-foreground leading-relaxed">
                    Note: Watermark appearance may vary slightly based on final export resolution. The preview uses a scaled-down representation for speed.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Configuration Sidebar */}
        <aside className="w-80 border-l bg-white dark:bg-slate-950 p-6 overflow-y-auto hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-widest">Settings</h2>
          </div>
          <SidebarControls />
        </aside>
      </main>
      {isProcessing && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 bg-white dark:bg-slate-900 border shadow-2xl rounded-xl p-6 animate-in slide-in-from-bottom-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold">Processing Batch...</span>
            <span className="text-sm font-mono">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}
import { Settings2 } from 'lucide-react';