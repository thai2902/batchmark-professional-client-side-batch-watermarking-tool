import JSZip from 'jszip';
import { drawWatermark } from '../lib/watermark-engine';
import { WatermarkConfig } from '../types';
self.onmessage = async (e: MessageEvent<{ images: { file: File; id: string }[], config: WatermarkConfig }>) => {
  const { images, config } = e.data;
  const zip = new JSZip();
  let watermarkBitmap: ImageBitmap | null = null;
  if (config.type === 'image' && config.image) {
    try {
      const res = await fetch(config.image);
      const blob = await res.blob();
      watermarkBitmap = await createImageBitmap(blob);
    } catch (err) {
      console.error("Failed to load watermark bitmap in worker:", err);
    }
  }
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    try {
      const bitmap = await createImageBitmap(item.file);
      // CRITICAL: We use original bitmap dimensions to ensure pixel-perfect 1:1 resolution exports.
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await drawWatermark(ctx, bitmap, config, bitmap.width, bitmap.height, watermarkBitmap);
        const mimeType = config.exportFormat === 'png' ? 'image/png' : 'image/jpeg';
        const extension = config.exportFormat === 'png' ? 'png' : 'jpg';
        // Quality argument only applies to image/jpeg and image/webp
        const blob = await canvas.convertToBlob({ 
          type: mimeType, 
          quality: config.exportFormat === 'jpeg' ? config.exportQuality : undefined 
        });
        const fileNameWithoutExt = item.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${fileNameWithoutExt}_watermarked.${extension}`, blob);
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