import JSZip from 'jszip';
import { drawWatermark } from '../lib/watermark-engine';
import { WatermarkConfig } from '../store/batchStore';
self.onmessage = async (e: MessageEvent<{ images: { file: File; id: string }[], config: WatermarkConfig }>) => {
  const { images, config } = e.data;
  const zip = new JSZip();
  let watermarkBitmap: ImageBitmap | null = null;
  if (config.type === 'image' && config.image) {
    // Load watermark logo once before processing batch
    const res = await fetch(config.image);
    const blob = await res.blob();
    watermarkBitmap = await createImageBitmap(blob);
  }
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    try {
      const bitmap = await createImageBitmap(item.file);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await drawWatermark(ctx, bitmap, config, bitmap.width, bitmap.height, watermarkBitmap);
        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
        zip.file(`watermarked_${item.file.name}`, blob);
      }
      bitmap.close();
      self.postMessage({ type: 'progress', value: Math.round(((i + 1) / images.length) * 100) });
    } catch (err) {
      console.error(`Error processing image ${item.file.name}:`, err);
    }
  }
  if (watermarkBitmap) {
    watermarkBitmap.close();
  }
  const content = await zip.generateAsync({ type: 'blob' });
  self.postMessage({ type: 'complete', blob: content });
};