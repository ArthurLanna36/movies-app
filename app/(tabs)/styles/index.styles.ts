// app/(tabs)/index.styles.ts
import { WHEEL_SIZE } from '@/constants/GameSettings'; // Mantenha a importação se usada nos estilos
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2F7',
  },
  container: {
    width: '100%',
    maxWidth: 500, // Limita a largura em telas maiores
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
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
    borderColor: '#0D47A1',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
  resultText: {
    fontSize: 18,
    color: '#2E7D32',
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0D47A1',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  emptyWheelText: {
    fontSize: 16,
    color: '#555',
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