import { WHEEL_SIZE } from '@/constants/GameSettings'; //
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor removido, será aplicado dinamicamente
  },
  container: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    // color removida
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textInput: {
    height: 45,
    // borderColor removida
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 20
  },
  wheelArea: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE + 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 20,
  },
  pointerContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    alignSelf: 'center',
  },
  wheelGraphicContainer: {
    position: 'absolute',
    top: 30,
  },
  actionButtonContainer: {
    width: '80%',
    maxWidth: 250,
    marginTop: 10,
  },
  resultText: { // A cor será aplicada por ThemedText
    fontSize: 30,
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: { // A cor será aplicada por ThemedText
    marginTop: 8,
    fontSize: 14,
  },
  errorText: { // A cor pode ser condicional no componente ou ThemedText
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  emptyWheelText: { // A cor será aplicada por ThemedText
    fontSize: 16,
    marginVertical: 30,
    textAlign: 'center',
  },
  clearButtonContainer: {
    width: '80%',
    maxWidth: 250,
    marginTop: 20,
    marginBottom: 20,
  }
});