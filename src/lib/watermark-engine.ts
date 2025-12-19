import { WatermarkConfig } from '@/store/batchStore';
export async function drawWatermark(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: HTMLImageElement | ImageBitmap,
  config: WatermarkConfig,
  width: number,
  height: number
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
      tl: [textWidth / 2 + 20, textHeight / 2 + 20],
      tc: [width / 2, textHeight / 2 + 20],
      tr: [width - textWidth / 2 - 20, textHeight / 2 + 20],
      ml: [textWidth / 2 + 20, height / 2],
      mc: [width / 2, height / 2],
      mr: [width - textWidth / 2 - 20, height / 2],
      bl: [textWidth / 2 + 20, height - textHeight / 2 - 20],
      bc: [width / 2, height - textHeight / 2 - 20],
      br: [width - textWidth / 2 - 20, height - textHeight / 2 - 20],
    };
    if (config.position === 'tiled') {
      const stepX = textWidth + config.gap;
      const stepY = textHeight + config.gap;
      for (let x = 0; x < width + stepX; x += stepX) {
        for (let y = 0; y < height + stepY; y += stepY) {
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
  } else if (config.type === 'image' && config.image) {
    // Handling image watermarks would require loading the watermark image first
    // This is a simplified placeholder for the engine logic
  }
  ctx.restore();
}