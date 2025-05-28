// constants/GameSettings.ts
// Não importamos mais INITIAL_MOVIES aqui, pois a lista de itens virá dinamicamente

export const WHEEL_SIZE = 325;
// ITEMS_ON_WHEEL e SEGMENT_ANGLE_DEG serão calculados dinamicamente
// ou passados para os componentes/hooks que precisam deles.
// Mantemos o raio do círculo do item e o raio da órbita, que são mais fixos.
export const ITEM_CIRCLE_RADIUS = 30; // Ajustado para imagens
export const ITEMS_ORBIT_RADIUS = WHEEL_SIZE / 2 - ITEM_CIRCLE_RADIUS - 15;
export const POINTER_COLOR = "#000000";
export const POINTER_SIZE = 40;

// SEGMENT_ANGLE_DEG_BASE pode ser usado como um nome mais genérico se você ainda quiser
// uma constante base, mas geralmente o ângulo será 360 / items.length
// export const SEGMENT_ANGLE_DEG_BASE = 36; // Para 10 itens