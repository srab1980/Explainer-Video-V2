export interface Project {
  id: string; // uuid
  title: string;
  script: string;
  scenes: Scene[];
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface Scene {
  id: string; // uuid
  order: number; // 0-indexed position in timeline
  text: string;
  keywords: string[];
  duration: number; // seconds
  illustrations: Illustration[];
  animation: AnimationType;
  layout: LayoutConfig;
}

export interface Illustration {
  id: string; // uuid
  library: 'lucide' | 'heroicons';
  iconName: string;
  keyword: string;
  color: string; // hex color code
  size: 'small' | 'medium' | 'large' | 'extra-large';
  position: { x: number; y: number }; // percentage-based
  rotation: number; // degrees
  aspectRatio: number;
}

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce';

export interface LayoutConfig {
  style: 'horizontal-row' | 'vertical-stack' | 'grid-2x2' | 'grid-3x3' | 'centered-large' | 'side-by-side' | 'scattered' | 'editorial';
  illustrationSize: 'small' | 'medium' | 'large' | 'extra-large';
  textPosition: 'overlay-bottom' | 'overlay-top' | 'top' | 'bottom' | 'left' | 'right';
}
