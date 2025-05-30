// app/(tabs)/styles/watched.styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window"); // Renamed for clarity
const containerPaddingHorizontal = 10; // Matches padding in styles.container
const posterGap = 8;
const numColumns = 3;

// Calculate the width available for the FlatList content (after parent container's padding)
const flatListAvailableWidth = screenWidth - containerPaddingHorizontal * 2;

// Calculate posterWidth, using Math.floor to prevent subpixel layout issues
// This formula accounts for (numColumns + 1) total gap units around/between items
const posterWidth = Math.floor(
  (flatListAvailableWidth - posterGap * (numColumns + 1)) / numColumns
);
const posterHeight = posterWidth * 1.5; // Standard poster aspect ratio

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: containerPaddingHorizontal, // Ensured this matches the constant used above
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 15,
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
    paddingHorizontal: posterGap / 2, // This padding is inside the FlatList
  },
  movieItemOuterContainer: {
    width: posterWidth, // Use the calculated and floored posterWidth
    margin: posterGap / 2, // This margin is around each item
    alignItems: "center",
  },
  movieItemContainer: {
    width: "100%",
    alignItems: "center",
  },
  posterImage: {
    width: posterWidth, // Use the calculated and floored posterWidth
    height: posterHeight,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  movieTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    flexShrink: 1,
  },
  deleteButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.3)",
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
    // Font family will be inherited from Paper theme if set
  },
});
