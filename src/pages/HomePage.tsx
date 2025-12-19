import React from 'react';
import { useBatchStore } from '@/store/batchStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dropzone } from '@/components/watermark/Dropzone';
import { ImageGallery } from '@/components/watermark/ImageGallery';
import { CanvasPreview } from '@/components/watermark/CanvasPreview';
import { SidebarControls } from '@/components/watermark/SidebarControls';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, LayoutDashboard, Layers, Info, Trash2, Settings2 } from 'lucide-react';
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
  const canProcess = images.length > 0 && !isProcessing && (config.type === 'text' || !!config.image);
  const handleProcessBatch = async () => {
    if (images.length === 0) return;
    if (config.type === 'image' && !config.image) {
      toast.error('Please upload a logo image first');
      return;
    }
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
          saveAs(e.data.blob, `batchmark-${Date.now()}.zip`);
          setProcessing(false);
          toast.success('Batch processing complete!');
          worker.terminate();
        }
      };
      worker.onerror = () => {
        toast.error('Worker error occurred during processing');
        setProcessing(false);
        worker.terminate();
      };
    } catch (err) {
      console.error(err);
      toast.error('Failed to start batch processing');
      setProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <header className="h-16 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">BatchMark</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="relative top-0 right-0" />
          <Button
            onClick={handleProcessBatch}
            disabled={!canProcess}
            className="shadow-md shadow-indigo-500/10 font-bold px-4 sm:px-6"
          >
            {isProcessing ? `Processing ${progress}%` : "Process Batch"}
            {!isProcessing && <Download className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Gallery & Dropzone Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Image Workspace</h1>
                  {images.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearImages} className="text-destructive border-destructive/20 hover:bg-destructive/5">
                      <Trash2 className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                  )}
                </div>
                <Dropzone />
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  <div className="xl:col-span-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <LayoutDashboard className="w-4 h-4" /> 
                      Batch Queue
                    </div>
                    <div className="bg-white dark:bg-slate-950 rounded-xl border p-4 shadow-sm">
                      <ImageGallery />
                    </div>
                  </div>
                  <div className="xl:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <Info className="w-4 h-4" /> 
                      Preview
                    </div>
                    <CanvasPreview />
                    <p className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <strong>Note:</strong> Final exports are generated at original resolution. The preview above is optimized for performance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Configuration Sidebar */}
        <aside className="w-[360px] border-l bg-white dark:bg-slate-950 hidden md:block overflow-hidden flex flex-col">
          <div className="p-6 border-b flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm uppercase tracking-widest">Watermark Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <SidebarControls />
          </div>
        </aside>
      </main>
      {isProcessing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-white dark:bg-slate-900 border shadow-2xl rounded-2xl p-6 animate-in slide-in-from-bottom-4 z-50 ring-1 ring-black/5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-sm font-bold">Processing images...</span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}