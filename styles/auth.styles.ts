// styles/auth.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 18,
  },
  actionButton: {
    width: "100%",
    marginTop: 10,
    paddingVertical: 4,
  },
  toggleText: {
    marginTop: 25,
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: -5,
    fontSize: 14,
    minHeight: 20,
  },
  loadingContainer: {
    // Adicionado para sobrepor durante o carregamento
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 10,
  },
});

export default styles;
