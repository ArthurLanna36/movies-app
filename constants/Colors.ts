const tintColorLight = '#0a7ea4';
const tintColorDark = '#FFFFFF'; // Usado como fundo de botões primários no tema escuro

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    buttonText: '#FFFFFF', 
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark, 
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    buttonText: '#151718', // Texto escuro para botões com fundo claro (tint)
  },
};