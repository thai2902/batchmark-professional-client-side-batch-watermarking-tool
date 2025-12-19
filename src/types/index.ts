export type WatermarkPosition = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br' | 'tiled';
export interface WatermarkConfig {
  type: 'text' | 'image';
  text: string;
  image: string | null; // Data URL for the logo
  opacity: number; // 0-100
  scale: number; // 10-200 (for image size %)
  rotate: number; // 0-360
  position: WatermarkPosition;
  color: string;
  fontSize: number; // Used for text scale
  fontFamily: string;
  gap: number;
}
export interface BatchImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
}