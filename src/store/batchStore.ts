import { create } from 'zustand';
export interface BatchImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
}
export interface WatermarkConfig {
  type: 'text' | 'image';
  text: string;
  image: string | null; // Data URL for the logo
  opacity: number; // 0-100
  scale: number; // 10-200 (for image size %)
  rotate: number; // 0-360
  position: 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br' | 'tiled';
  color: string;
  fontSize: number; // Used for text scale
  fontFamily: string;
  gap: number;
}
interface BatchState {
  images: BatchImage[];
  config: WatermarkConfig;
  activeImageId: string | null;
  isProcessing: boolean;
  progress: number;
  // Actions
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateConfig: (updates: Partial<WatermarkConfig>) => void;
  clearWatermarkImage: () => void;
  setActiveImage: (id: string | null) => void;
  setProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
}
export const useBatchStore = create<BatchState>((set) => ({
  images: [],
  activeImageId: null,
  isProcessing: false,
  progress: 0,
  config: {
    type: 'text',
    text: 'COPYRIGHT 2024',
    image: null,
    opacity: 50,
    scale: 20, // Default 20% of image width for logo
    rotate: 0,
    position: 'br',
    color: '#ffffff',
    fontSize: 48,
    fontFamily: 'sans-serif',
    gap: 100,
  },
  addImages: (files) => set((state) => {
    const newImages = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'idle' as const
    }));
    return {
      images: [...state.images, ...newImages],
      activeImageId: state.activeImageId || newImages[0]?.id || null
    };
  }),
  removeImage: (id) => set((state) => {
    const filtered = state.images.filter(img => {
      if (img.id === id) URL.revokeObjectURL(img.previewUrl);
      return img.id !== id;
    });
    return {
      images: filtered,
      activeImageId: state.activeImageId === id ? (filtered[0]?.id || null) : state.activeImageId
    };
  }),
  clearImages: () => set((state) => {
    state.images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    return { 
      images: [], 
      activeImageId: null,
      config: { ...state.config, image: null } // Reset logo on full clear
    };
  }),
  updateConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates }
  })),
  clearWatermarkImage: () => set((state) => ({
    config: { ...state.config, image: null }
  })),
  setActiveImage: (id) => set({ activeImageId: id }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setProgress: (progress) => set({ progress })
}));