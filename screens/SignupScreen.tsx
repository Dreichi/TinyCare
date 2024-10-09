import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Image } from "react-native";
import { supabase } from "../utils/supabase";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SignupScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: identifier,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.log(error);
      Alert.alert(error.message);
    } else {
      console.log("Signup successful");
      navigation.navigate("Home");
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 40}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/TinyCareLogo.png")}
              style={styles.logo}
            />
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>INSCRIPTION</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom</Text>
              <TextInput
                placeholder="Entrez votre Nom"
                placeholderTextColor="gray"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <TextInput
                placeholder="Entrez votre Prénom"
                placeholderTextColor="gray"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
              />
            </View>

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
              onPress={() => signUpWithEmail()}
              style={styles.submit}
            >
              <Text style={styles.textSubmit}>INSCRIPTION</Text>
            </Pressable>

            <Pressable>
              <Text
                style={styles.textLink}
                onPress={() => navigation.navigate("Login")}
              >
                Déjà un compte ? Connectez-vous
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoContainer: {
    flex: 0.25,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 32,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 0.75,
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
    fontFamily: "Montserrat_600SemiBold",
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
    fontFamily: "Montserrat_600SemiBold",
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
    fontFamily: "Montserrat_400Regular",
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
    fontFamily: "Montserrat_600SemiBold",
  },
  textLink: {
    color: "#849CCE",
    textAlign: "center",
    padding: 8,
  },
});
