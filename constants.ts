import { ModelDef } from './types';

export const INITIAL_MODELS: ModelDef[] = [
  {
    "name": "Love Heart",
    "type": "heart",
    "params": {
      "scale": 1,
      "color": "#ff5f9f",
      "particles": 2000
    },
    "thumbnail": `<path fill="#ff5f9f" d="M12 21s-7.5-4.35-9.5-9.14C1.1 9.1 2.2 5.5 5.4 4.4c2.1-.7 4.1.4 5.1 2.2 1-1.8 3-2.9 5.1-2.2 3.2 1.1 4.3 4.7 2.9 7.46C19.5 16.65 12 21 12 21z"/>`
  },
  {
    "name": "Saturn Ring",
    "type": "saturn",
    "params": {
      "ringDist": 12,
      "ringWidth": 4,
      "planetScale": 4,
      "color": "#f2c94c"
    },
    "thumbnail": `<circle cx="12" cy="12" r="4.5" fill="#f2c94c"/><ellipse cx="12" cy="12.5" rx="8" ry="2.8" fill="none" stroke="#8bc5ff" stroke-width="1.4"/>`
  },
  {
    "name": "Mystic Knot",
    "type": "torusKnot",
    "params": {
      "p": 2,
      "q": 3,
      "radius": 5,
      "tubeRadius": 1.5,
      "color": "#9b7bff"
    },
    "thumbnail": `<path fill="none" stroke="#9b7bff" stroke-width="1.6" d="M6 12c0-4 3-7 6-7s6 3 6 7-3 7-6 7-6-3-6-7z"/><path fill="none" stroke="#9b7bff" stroke-width="1.6" d="M4 9c2 2 14 2 16 0"/>`
  },
  {
    "name": "Neon Flower",
    "type": "flower",
    "params": {
      "k": 4,
      "radius": 8,
      "zRange": 2,
      "color": "#ff6bd6"
    },
    "thumbnail": `<circle cx="12" cy="12" r="3" fill="#ff9a3c"/><path fill="#ff6bd6" d="M12 4l1.5 3.5L17 9l-3.5 1.5L12 14l-1.5-3.5L7 9l3.5-1.5z"/>`
  },
  {
    "name": "Fireworks Ball",
    "type": "sphere",
    "params": {
      "radius": 8,
      "color": "#5edfff",
      "particles": 1500
    },
    "thumbnail": `<circle cx="12" cy="12" r="3" fill="#5edfff"/><path stroke="#5edfff" stroke-width="1.4" stroke-linecap="round" d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>`
  },
  {
    "name": "Star Shine",
    "type": "star",
    "params": {
      "outerRadius": 8,
      "innerRadius": 4,
      "points": 5,
      "depth": 2,
      "color": "#ffd166"
    },
    "thumbnail": `<path fill="#ffd166" d="M12 2.5l2.2 6.1 6.3.2-5 3.9 1.8 6.1L12 15.5l-5.3 3.3 1.8-6.1-5-3.9 6.3-.2z"/>`
  },
  {
    "name": "Cyber Cloud",
    "type": "cubeCloud",
    "params": {
      "size": 10,
      "count": 500,
      "color": "#7de1ff"
    },
    "thumbnail": `<rect x="6" y="6" width="12" height="12" fill="none" stroke="#7de1ff" stroke-width="1.4"/><rect x="9" y="4" width="11" height="11" fill="none" stroke="#7de1ff" stroke-width="1.2" opacity="0.7"/>`
  },
  {
    "name": "DNA Helix",
    "type": "doubleHelix",
    "params": {
      "radius": 4,
      "height": 15,
      "turns": 3,
      "color": "#ff9f6e"
    },
    "thumbnail": `<path fill="none" stroke="#ff9f6e" stroke-width="1.6" d="M8 4c0 4 8 4 8 8s-8 4-8 8"/><path fill="none" stroke="#5edfff" stroke-width="1.6" d="M16 4c0 4-8 4-8 8s8 4 8 8"/>`
  },
  {
    "name": "Audio Wave",
    "type": "wave",
    "params": {
      "amplitude": 3,
      "frequency": 0.5,
      "width": 15,
      "depth": 15,
      "color": "#00ffff"
    },
    "thumbnail": `<path fill="none" stroke="#00ffff" stroke-width="1.6" d="M3 12c4-2 8-2 12 0s8 2 12 0"/>`
  },
  {
    "name": "3D Text",
    "type": "text",
    "params": {
      "text": "GEMINI",
      "size": 4,
      "thickness": 1,
      "color": "#ffffff"
    },
    "thumbnail": `<text x="12" y="16" font-size="14" fill="#00ffff" text-anchor="middle" font-weight="bold">T</text>`
  }
];
