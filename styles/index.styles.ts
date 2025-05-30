import { WHEEL_SIZE } from "@/constants/GameSettings";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  pageTitle: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textInput: {
    height: 45,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 20,
  },
  wheelArea: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE + 30,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 20,
  },
  pointerContainer: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    alignSelf: "center",
  },
  wheelGraphicContainer: {
    position: "absolute",
    top: 30,
  },
  actionButtonContainer: {
    width: "80%",
    maxWidth: 250,
    marginTop: 10,
  },
  resultText: {
    fontSize: 30,
    marginTop: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  emptyWheelText: {
    fontSize: 16,
    marginVertical: 30,
    textAlign: "center",
  },
  clearButtonContainer: {
    width: "80%",
    maxWidth: 250,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default styles;
