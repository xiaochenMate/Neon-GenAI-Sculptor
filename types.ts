export interface ModelParams {
  [key: string]: number | string;
}

export interface ModelDef {
  name: string;
  type: string; // 'heart' | 'saturn' | 'torusKnot' | 'flower' | 'sphere' | 'star' | 'cubeCloud' | 'doubleHelix' | 'wave' | 'text'
  params: ModelParams;
  thumbnail: string; // SVG string
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
