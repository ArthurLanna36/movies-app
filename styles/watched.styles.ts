// styles/watched.styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const containerPaddingHorizontal = 10;
const posterGap = 8;
const numColumns = 3;

const flatListAvailableWidth = screenWidth - containerPaddingHorizontal * 2;

const posterWidth = Math.floor(
  (flatListAvailableWidth - posterGap * (numColumns + 1)) / numColumns
);
const posterHeight = posterWidth * 1.5;

const styles = StyleSheet.create({
  scrollContainer: {
    // Não parece ser usado neste arquivo, mas mantido do original
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: containerPaddingHorizontal,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5, // Adicionado para alinhar com o conteúdo da lista
  },
  textInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16, // Ajustado para consistência
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 15, // Ajuste para o botão não ficar muito largo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  listContentContainer: {
    paddingHorizontal: posterGap / 2, // Para dar espaço nas laterais da lista
    paddingBottom: posterGap, // Espaço no final da lista
  },
  movieItemOuterContainer: {
    width: posterWidth,
    margin: posterGap / 2,
    alignItems: "center",
  },
  movieItemContainer: {
    width: "100%",
    alignItems: "center",
  },
  posterImage: {
    width: posterWidth,
    height: posterHeight,
    borderRadius: 6,
    backgroundColor: "#e0e0e0", // Placeholder color
  },
  movieTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    flexShrink: 1, // Para evitar que o título empurre outros elementos
  },
  deleteButton: {
    position: "absolute",
    top: -5, // Ajuste para posicionamento do ícone
    right: -5, // Ajuste para posicionamento do ícone
    backgroundColor: "rgba(0,0,0,0.3)", // Fundo para melhor visibilidade
    borderRadius: 15,
    zIndex: 10,
  },
  dialogTitle: {
    textAlign: "center",
  },
  dialogContentText: {
    textAlign: "center",
  },
  dialogButtonLabel: {
    // A fonte será herdada se configurada no tema do Paper
  },
});

export default styles;
