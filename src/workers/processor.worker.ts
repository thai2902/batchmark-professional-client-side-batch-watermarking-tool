import JSZip from 'jszip';
import { drawWatermark } from '../lib/watermark-engine';
import { WatermarkConfig } from '../store/batchStore';
self.onmessage = async (e: MessageEvent<{ images: { file: File; id: string }[], config: WatermarkConfig }>) => {
  const { images, config } = e.data;
  const zip = new JSZip();
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const bitmap = await createImageBitmap(item.file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await drawWatermark(ctx, bitmap, config, bitmap.width, bitmap.height);
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
      zip.file(`watermarked_${item.file.name}`, blob);
    }
    self.postMessage({ type: 'progress', value: Math.round(((i + 1) / images.length) * 100) });
  }
  const content = await zip.generateAsync({ type: 'blob' });
  self.postMessage({ type: 'complete', blob: content });
};