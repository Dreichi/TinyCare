import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/supabase";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const getUsername = async () => {
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
        setUsername(data?.name);
        setPhone(data?.phonenumber);
        setEmail(data?.mail);
      } catch (error) {
        console.log("Erreur lors de la récupération de l'username:", error);
      }
    };

    getUsername();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate("Login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} />
      <View style={styles.subheader}>
        <View style={styles.iconBackground}>
          <FontAwesome name="user" size={60} color="white" />
        </View>
        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.infos}>
          {email} | {phone}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcons name="edit" size={24} color="#797979" />
            <Text style={styles.cardText}>Modifier les informations</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="notifications" size={24} color="#797979" />
            <Text style={styles.cardText}>Notifications</Text>
            <Text style={styles.cardValue}>OUI</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="language" size={24} color="#797979" />
            <Text style={styles.cardText}>Langue</Text>
            <Text style={styles.cardValue}>Français</Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcons name="brightness-6" size={24} color="#797979" />
            <Text style={styles.cardText}>Mode sombre</Text>
            <Text style={styles.cardValue}>NON</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="text-fields" size={24} color="#797979" />
            <Text style={styles.cardText}>Mode DYS</Text>
            <Text style={styles.cardValue}>SANS</Text>
          </View>
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcons name="support" size={24} color="#797979" />
            <Text style={styles.cardText}>Aide et support</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="lock" size={24} color="#797979" />
            <Text style={styles.cardText}>Politique de confidentialité</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F0FF",
  },
  header: {
    backgroundColor: "#274C86",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "13%",
  },
  subheader: {
    alignItems: "center",
    transform: [{ translateY: -80 }],
  },
  iconBackground: {
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
    padding: 20,
    width: 100,
    height: 100,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    color: "#6F6F6F",
    fontFamily: "Palanquin",
  },
  infos: {
    fontSize: 12,
    color: "#6F6F6F",
    fontFamily: "Palanquin",
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    transform: [{ translateY: -50 }],
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#797979",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: "#797979",
    marginLeft: 15,
    fontFamily: "Palanquin",
  },
  cardValue: {
    color: "#274C86",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#114187",
    borderRadius: 4,
    width: 200,
    alignSelf: "center",
    marginBottom: 30,
    transform: [{ translateY: -50 }],
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Palanquin_600SemiBold",
  },
});

export default UserProfile;
