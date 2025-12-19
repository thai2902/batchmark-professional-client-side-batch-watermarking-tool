import { WatermarkConfig } from '@/store/batchStore';
export async function drawWatermark(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: HTMLImageElement | ImageBitmap,
  config: WatermarkConfig,
  width: number,
  height: number,
  watermarkImg?: HTMLImageElement | ImageBitmap | null
) {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  ctx.save();
  ctx.globalAlpha = config.opacity / 100;
  if (config.type === 'text') {
    ctx.fillStyle = config.color;
    ctx.font = `${config.fontSize * (width / 1000)}px ${config.fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const text = config.text;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = config.fontSize * (width / 1000);
    const positions: Record<string, [number, number]> = {
      tl: [textWidth / 2 + 40, textHeight / 2 + 40],
      tc: [width / 2, textHeight / 2 + 40],
      tr: [width - textWidth / 2 - 40, textHeight / 2 + 40],
      ml: [textWidth / 2 + 40, height / 2],
      mc: [width / 2, height / 2],
      mr: [width - textWidth / 2 - 40, height / 2],
      bl: [textWidth / 2 + 40, height - textHeight / 2 - 40],
      bc: [width / 2, height - textHeight / 2 - 40],
      br: [width - textWidth / 2 - 40, height - textHeight / 2 - 40],
    };
    if (config.position === 'tiled') {
      const stepX = textWidth + config.gap;
      const stepY = textHeight + config.gap;
      for (let x = -stepX; x < width + stepX; x += stepX) {
        for (let y = -stepY; y < height + stepY; y += stepY) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((config.rotate * Math.PI) / 180);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      const [px, py] = positions[config.position] || positions.br;
      ctx.translate(px, py);
      ctx.rotate((config.rotate * Math.PI) / 180);
      ctx.fillText(text, 0, 0);
    }
  } else if (config.type === 'image' && watermarkImg) {
    const wmWidth = (config.scale / 100) * width;
    const aspectRatio = watermarkImg.height / watermarkImg.width;
    const wmHeight = wmWidth * aspectRatio;
    const margin = 40;
    const positions: Record<string, [number, number]> = {
      tl: [margin, margin],
      tc: [width / 2 - wmWidth / 2, margin],
      tr: [width - wmWidth - margin, margin],
      ml: [margin, height / 2 - wmHeight / 2],
      mc: [width / 2 - wmWidth / 2, height / 2 - wmHeight / 2],
      mr: [width - wmWidth - margin, height / 2 - wmHeight / 2],
      bl: [margin, height - wmHeight - margin],
      bc: [width / 2 - wmWidth / 2, height - wmHeight - margin],
      br: [width - wmWidth - margin, height - wmHeight - margin],
    };
    if (config.position === 'tiled') {
      const stepX = wmWidth + config.gap;
      const stepY = wmHeight + config.gap;
      for (let x = -stepX; x < width + stepX; x += stepX) {
        for (let y = -stepY; y < height + stepY; y += stepY) {
          ctx.save();
          ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
          ctx.rotate((config.rotate * Math.PI) / 180);
          ctx.drawImage(watermarkImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
          ctx.restore();
        }
      }
    } else {
      const [px, py] = positions[config.position] || positions.br;
      ctx.save();
      ctx.translate(px + wmWidth / 2, py + wmHeight / 2);
      ctx.rotate((config.rotate * Math.PI) / 180);
      ctx.drawImage(watermarkImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
      ctx.restore();
    }
  }
  ctx.restore();
}