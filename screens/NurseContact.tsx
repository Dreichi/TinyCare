import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function NurseContact({ navigation }: any) {
  const [nurses, setNurses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const fetchNurses = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, role")
        .eq("role", "manager");

      if (error) {
        console.error("Erreur lors de la récupération des soignants :", error);
      } else {
        setNurses(data);
      }
    };

    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id;
      if (user) {
        const { data: profileData, error } = await supabase
          .from("users")
          .select("id, name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil :", error);
        } else {
          setProfile(profileData);
        }
      } else {
        console.error("Aucun utilisateur connecté");
      }
    };

    fetchNurses();
    fetchProfile();
  }, []);

  const handleOpenConversation = async (nurse: any) => {
    if (!profile?.id || !nurse?.id) {
      console.error(
        "Les IDs de l'utilisateur ou de l'infirmière sont manquants."
      );
      return;
    }

    try {
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("id")
        .or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`)
        .or(`user1_id.eq.${nurse.id},user2_id.eq.${nurse.id}`)
        .eq("user1_id", profile.id)
        .eq("user2_id", nurse.id)
        .single();

      let conversationId;
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        const { data: newConversation, error } = await supabase
          .from("conversations")
          .insert([{ user1_id: profile.id, user2_id: nurse.id }])
          .select("id")
          .single();

        if (error) {
          console.error(
            "Erreur lors de la création de la conversation :",
            error
          );
          return;
        }
        conversationId = newConversation.id;
      }

      navigation.navigate("ChatScreen", {
        conversationId,
        otherUserName: nurse.name,
      });
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la conversation :", error);
    }
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      style={styles.menuButton}
      key={item.id}
      onPress={() => handleOpenConversation(item)}
    >
      <Text style={styles.menuIcon}>👩‍⚕️</Text>
      <Text style={styles.menuText}>{item.name}</Text>
      <Text style={styles.arrow}>➔</Text>
    </TouchableOpacity>
  );

  const handleCallService = () => {
    Linking.openURL("tel:+123456789");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/form.png")}
        style={styles.topImage}
        blurRadius={0.8}
      ></Image>
      <Image
        source={require("../assets/form.png")}
        style={styles.botImage}
        blurRadius={0.8}
      ></Image>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>📞 Contacter le soignant</Text>
        </View>
        <View>
          <Pressable style={styles.submit} onPress={handleCallService}>
            <Text style={styles.textSubmit}>APPELER LE SERVICE</Text>
          </Pressable>
        </View>
        <View style={styles.menuContainer}>{nurses.map(renderMenuItem)}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F0FF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#274C86",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    padding: 20,
    marginBottom: 20,
    height: Platform.OS === "ios" ? 100 : 130,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  topImage: {
    position: "absolute",
    top: 100,
    right: -300,
    width: "100%",
    height: 400,
    transform: [{ rotate: "0deg" }],
  },
  botImage: {
    position: "absolute",
    bottom: -150,
    left: -300,
    width: "100%",
    height: 300,
    transform: [{ rotate: "0deg" }],
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
    marginVertical: 16,
  },
  textSubmit: {
    color: "white",
    textAlign: "center",
    fontFamily: "Palanquin_600SemiBold",
  },
  menuContainer: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  menuButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#797979",
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6F6F6F",
    flex: 1,
    marginLeft: 10,
  },
  menuIcon: {
    backgroundColor: "#A2BFE9",
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#797979",
    overflow: "hidden",
    fontSize: 32,
  },
  arrow: {
    fontSize: 18,
    color: "#FFFFFF",
    backgroundColor: "#274C86",
    padding: 8,
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: 18,
    borderColor: "#274C86",
  },
});
