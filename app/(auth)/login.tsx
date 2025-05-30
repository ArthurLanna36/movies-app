// app/(auth)/login.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/auth.styles"; // Caminho atualizado
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import {
  Button as PaperButton,
  Text as PaperText,
  useTheme as usePaperTheme,
} from "react-native-paper";

export default function LoginScreen() {
  const paperTheme = usePaperTheme();
  const { signIn, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    clearError();
    await signIn(email, password);
    // Navegação é gerenciada pelo RootLayout
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
          MovieDeck
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
            placeholder="Password"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {authError && (
          <PaperText
            style={[styles.errorText, { color: paperTheme.colors.error }]}
          >
            {authError.message.includes("auth/invalid-credential") ||
            authError.message.includes("auth/user-not-found") ||
            authError.message.includes("auth/wrong-password")
              ? "Invalid email or password."
              : authError.message
                  .replace(/Firebase: /g, "")
                  .replace(/Error /g, "")}
          </PaperText>
        )}

        <PaperButton
          mode="contained"
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.actionButton} // Não precisa de loading prop aqui, o overlay cuida disso
          labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 22 }}
          textColor={paperTheme.colors.onPrimary}
        >
          Login
        </PaperButton>

        <ThemedText type="default" style={styles.toggleText}>
          Don&apos;t have an account?{" "}
          <Link href="/(auth)/register" asChild>
            <ThemedText type="link" style={styles.linkText}>
              Sign Up
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        </View>
      )}
    </ScrollView>
  );
}
