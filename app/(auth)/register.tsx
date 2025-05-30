// app/(auth)/register.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/auth.styles"; // Assuming styles are in root/styles
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import {
  Button as PaperButton,
  Text as PaperText,
  useTheme as usePaperTheme,
} from "react-native-paper";

export default function RegisterScreen() {
  const paperTheme = usePaperTheme();
  const { signUp, isLoading, error: authErrorHook, clearError } = useAuth(); // Renamed authError to authErrorHook

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null); // For client-side validation

  const handleRegister = async () => {
    clearError(); // Clear errors from AuthContext
    setLocalError(null); // Clear local client-side errors

    if (!username.trim()) {
      setLocalError("Please enter a username.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password should be at least 6 characters.");
      return;
    }

    const signedUpUser = await signUp(email, password, username);

    if (!signedUpUser && authErrorHook) {
      // If signUp fails and sets an error in AuthContext, display it
      // (e.g. username taken, email already in use by Firebase Auth)
      setLocalError(
        authErrorHook.message.replace(/Firebase: /g, "").replace(/Error /g, "")
      );
    }
    // Navigation is handled by RootLayout's useEffect based on `user` state in AuthContext
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: paperTheme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView
        style={[styles.container, { backgroundColor: "transparent" }]}
      >
        <ThemedText type="title" style={styles.pageTitle}>
          Create Account
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: paperTheme.colors.primary,
                color: paperTheme.colors.onSurface,
                backgroundColor: paperTheme.colors.surfaceVariant,
                fontFamily: "GlassAntiqua-Inline",
              },
            ]}
            placeholder="Username"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: paperTheme.colors.primary,
                color: paperTheme.colors.onSurface,
                backgroundColor: paperTheme.colors.surfaceVariant,
                fontFamily: "GlassAntiqua-Inline",
              },
            ]}
            placeholder="Email"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: paperTheme.colors.primary,
                color: paperTheme.colors.onSurface,
                backgroundColor: paperTheme.colors.surfaceVariant,
                fontFamily: "GlassAntiqua-Inline",
              },
            ]}
            placeholder="Password (min. 6 characters)"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: paperTheme.colors.primary,
                color: paperTheme.colors.onSurface,
                backgroundColor: paperTheme.colors.surfaceVariant,
                fontFamily: "GlassAntiqua-Inline",
              },
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {localError && ( // Display local errors first, then AuthContext errors if localError is null
          <PaperText
            style={[styles.errorText, { color: paperTheme.colors.error }]}
          >
            {localError}
          </PaperText>
        )}

        <PaperButton
          mode="contained"
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.actionButton}
          labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 22 }}
          textColor={paperTheme.colors.onPrimary}
        >
          Register
        </PaperButton>

        <ThemedText type="default" style={styles.toggleText}>
          Already have an account?{" "}
          <Link href="/(auth)/login" asChild>
            <ThemedText type="link" style={styles.linkText}>
              Login
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
      {isLoading && ( // Overlay loading indicator
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        </View>
      )}
    </ScrollView>
  );
}
