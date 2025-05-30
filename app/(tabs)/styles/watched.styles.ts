// app/(tabs)/styles/watched.styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const posterGap = 8;
const numColumns = 3; // Ajuste conforme desejado
const posterWidth = (width - posterGap * (numColumns + 1)) / numColumns;
const posterHeight = posterWidth * 1.5; // Proporção comum de pôster

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  container: {
    width: "100%",
    flex: 1, // Para o FlatList ocupar o espaço disponível
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 32, // Ajustar se o título da aba já for suficiente
    textAlign: "center",
    marginVertical: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5, // Adicionado para espaçamento do input
  },
  textInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16, // Ajustado para melhor leitura
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 15, // Ajustar para o botão de papel
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  // Grid styles
  listContentContainer: {
    paddingHorizontal: posterGap / 2, // Para compensar o gap nos lados
  },
  movieItemContainer: {
    width: posterWidth,
    margin: posterGap / 2,
    alignItems: "center", // Centraliza o texto do título
  },
  posterImage: {
    width: posterWidth,
    height: posterHeight,
    borderRadius: 6,
    backgroundColor: "#e0e0e0", // Placeholder background
  },
  movieTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    flexShrink: 1, // Permite que o texto quebre se necessário
  },
  // Dialog
  dialogTitle: {
    textAlign: "center",
    // fontFamily já virá do tema do Paper
  },
  dialogContentText: {
    textAlign: "center",
    // fontFamily já virá do tema do Paper
  },
  dialogButtonLabel: {
    // fontFamily já virá do tema do Paper
  },
});
