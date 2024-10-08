import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { useEmail } from "../context/EmailContext";

interface VerifyScreenProps {
  route: {
    params?: {
      email?: string;
    };
  };
  navigation: any;
}

export default function VerifyScreen({ route, navigation }: VerifyScreenProps) {
  const { email: emailFromSignup } = route.params || {};
  const { email: emailContext, setEmail: setEmailContext } = useEmail();
  const [email, setEmail] = useState<string>(
    emailFromSignup || emailContext || ""
  );
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (emailFromSignup) {
      setEmailContext(emailFromSignup);
    }
  }, [emailFromSignup]);

  // const handleVerification = async () => {
  //   try {
  //     const response = await axios.post(`${apiUrl}/users/activate`, {
  //       identifier: email,
  //       code,
  //     });

  //     console.log("Response:", response.data); // Log de la réponse
  //     if (response.status === 200) {
  //       Alert.alert("Succès", "Votre compte a été vérifié et activé.");
  //       navigation.navigate("Login");
  //     } else {
  //       Alert.alert(
  //         "Erreur",
  //         "Une erreur est survenue lors de l'activation du compte."
  //       );
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       console.error("Error data:", error.response.data); // Log des données d'erreur
  //       console.error("Error status:", error.response.status); // Log du statut d'erreur
  //     } else {
  //       console.error(error); // Log de l'erreur générale
  //     }
  //     Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
  //   }
  // };

  // const resendVerifCode = async () => {
  //   try {
  //     const response = await axios.post(`${apiUrl}/users/resend-verification`, {
  //       identifier: email,
  //     });

  //     console.log("Response:", response.data); // Log de la réponse

  //     if (response.status === 201) {
  //       Alert.alert("Succès", "Un nouveau code a été envoyé à votre email.");
  //     } else {
  //       Alert.alert(
  //         "Erreur",
  //         "Une erreur est survenue lors de l'envoi du code."
  //       );
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       console.error("Error data:", error.response.data); // Log des données d'erreur
  //       console.error("Error status:", error.response.status); // Log du statut d'erreur
  //     } else {
  //       console.error(error); // Log de l'erreur générale
  //     }
  //     Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </Text>
      <Text style={styles.title}>VÉRIFICATION</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="white"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Code de vérification"
        placeholderTextColor="white"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <Pressable style={styles.submit}>
        <Text style={styles.textSubmit}>VÉRIFIER</Text>
      </Pressable>
      <TouchableOpacity>
        <Text style={styles.linkText}>Renvoyer le code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    marginBottom: 128,
  },
  logo: {
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: "center",
    color: "#347355",
    fontFamily: "Montserrat_600SemiBold",
  },
  submit: {
    backgroundColor: "rgba(52, 115, 85, 1)",
    padding: 4,
    borderRadius: 6,
    height: 50,
    justifyContent: "center",
    maxWidth: 300,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textSubmit: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  input: {
    height: 50,
    borderColor: "transparent",
    fontSize: 12,
    borderRadius: 6,
    backgroundColor: "rgba(13, 13, 13, 0.8)",
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "white",
    padding: 4,
    fontFamily: "Montserrat_600SemiBold",
    maxWidth: 300,
    alignSelf: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkText: {
    marginTop: 16,
    color: "#2F90E5",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
  linkTextSub: {
    color: "#2F90E5",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
});
