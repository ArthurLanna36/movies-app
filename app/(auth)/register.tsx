import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/auth.styles";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import {
  Button as PaperButton,
  Text as PaperText,
  useTheme as usePaperTheme,
} from "react-native-paper";

export default function RegisterScreen() {
  const paperTheme = usePaperTheme();
  const router = useRouter();
  const { signUp, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    clearError();
    if (password !== confirmPassword) {
      alert("Passwords don't match."); // Or use a themed dialog
      return;
    }
    const user = await signUp(email, password);
    if (user) {
      // Navigation to /(tabs) will be handled by RootLayout
    }
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

        {authError && (
          <PaperText
            style={[styles.errorText, { color: paperTheme.colors.error }]}
          >
            {authError.message.replace(/Firebase: /g, "")}
          </PaperText>
        )}

        <PaperButton
          mode="contained"
          onPress={handleRegister}
          disabled={isLoading}
          loading={isLoading}
          style={styles.actionButton}
          labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 22 }}
          textColor={paperTheme.colors.onPrimary}
        >
          {isLoading ? "Creating Account..." : "Register"}
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        </View>
      )}
    </ScrollView>
  );
}
