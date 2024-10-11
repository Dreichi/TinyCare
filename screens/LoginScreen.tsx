import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Image } from "react-native";
import { supabase } from "../utils/supabase";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else {
      console.log("Login successful");
      navigation.navigate("Home");
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/TinyCareLogo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>CONNEXION</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="Entrez votre email"
              placeholderTextColor="gray"
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable
            disabled={loading}
            onPress={() => signInWithEmail()}
            style={styles.submit}
          >
            <Text style={styles.textSubmit}>CONNEXION</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.textLink}>Mot de passe oublié ?</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.textLink}>Pas de compte ? Inscrivez-vous</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 0,
    backgroundColor: "#DCE1EB",
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 0 : 32,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 0.7,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
    textAlign: "center",
    color: "rgba(17, 65, 135, 1)",
    fontFamily: "Palanquin_600SemiBold",
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
    fontFamily: "Palanquin_600SemiBold",
  },
  input: {
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000",
    fontFamily: "Palanquin_400Regular",
  },
  submit: {
    backgroundColor: "rgba(17, 65, 135, 1)",
    padding: 4,
    borderRadius: 50,
    height: 50,
    justifyContent: "center",
    maxWidth: 300,
    width: "100%",
    alignSelf: "center",
  },
  textSubmit: {
    color: "white",
    textAlign: "center",
    fontFamily: "Palanquin_600SemiBold",
  },
  textLink: {
    color: "#849CCE",
    textAlign: "center",
    marginTop: 16,
  },
});
