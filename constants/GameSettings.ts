// constants/GameSettings.ts
export const WHEEL_SIZE = 325;
export const NUMBERS_ON_WHEEL = Array.from({ length: 10 }, (_, i) => i + 1);
export const SEGMENT_ANGLE_DEG = 360 / NUMBERS_ON_WHEEL.length;
export const ITEM_CIRCLE_RADIUS = 30;
// Ajustado para WHEEL_SIZE = 325 e ITEM_CIRCLE_RADIUS = 30
export const ITEMS_ORBIT_RADIUS = WHEEL_SIZE / 2 - ITEM_CIRCLE_RADIUS - 25; 
export const POINTER_COLOR = "#000000"; // Cor preta para o ponteiro
export const POINTER_SIZE = 40;