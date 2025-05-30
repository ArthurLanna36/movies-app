// components/ui/IconSymbol.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; //
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; //
import { SymbolViewProps, SymbolWeight } from "expo-symbols"; //
import { ComponentProps } from "react"; //
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native"; //

type IconMapping = Record<
  string,
  {
    set: "MaterialIcons" | "MaterialCommunityIcons";
    name:
      | ComponentProps<typeof MaterialIcons>["name"]
      | ComponentProps<typeof MaterialCommunityIcons>["name"];
  }
>;

const MAPPING: IconMapping = {
  "house.fill": { set: "MaterialIcons", name: "home" },
  "chevron.right": { set: "MaterialIcons", name: "chevron-right" },
  "star.fill": { set: "MaterialIcons", name: "star" },
  "clover.fill": { set: "MaterialCommunityIcons", name: "clover" },
  "playlist-check": { set: "MaterialCommunityIcons", name: "playlist-check" },
  "sun.max.fill": { set: "MaterialIcons", name: "wb-sunny" },
  "moon.fill": { set: "MaterialIcons", name: "brightness-3" },
  logout: { set: "MaterialCommunityIcons", name: "logout" }, // Ícone de logout adicionado
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight, // weight é ignorado aqui, mas mantido para compatibilidade com a versão iOS se houver
}: {
  name: keyof typeof MAPPING | SymbolViewProps["name"];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconInfo = MAPPING[name as string];

  if (iconInfo) {
    if (iconInfo.set === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          color={color as string}
          size={size}
          name={iconInfo.name as any}
          style={style}
        />
      );
    }
    return (
      <MaterialIcons
        color={color}
        size={size}
        name={iconInfo.name as any}
        style={style}
      />
    );
  }

  console.warn(
    `IconSymbol: Ícone não mapeado '${name}', usando fallback 'help-outline'.` //
  );
  return (
    <MaterialIcons
      color={color}
      size={size}
      name="help-outline"
      style={style}
    />
  );
}
