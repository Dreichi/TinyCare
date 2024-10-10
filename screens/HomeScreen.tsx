import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase";

type Baby = {
  id: number;
  first_name: string;
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [selectedChild, setSelectedChild] = useState<Baby | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [children, setChildren] = useState<Baby[]>([]);
  const [userName, setUserName] = useState("utilisateur");

  useEffect(() => {
    const getBabies = async () => {
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;

      if (user) {
        const userId = user.id;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("babies, name")
          .eq("id", userId)
          .single();

        setUserName(userData?.name);
        if (userError) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            userError.message
          );
          return;
        }

        const babyIds = Array.isArray(userData?.babies?.babies)
          ? userData.babies.babies.map(
              (baby: { baby_id: number }) => baby.baby_id
            )
          : [];

        if (babyIds.length === 0) return;

        const { data: babies, error: babiesError } = await supabase
          .from("baby")
          .select("*")
          .in("id", babyIds);

        if (babiesError) {
          console.error(
            "Erreur lors de la récupération des bébés:",
            babiesError.message
          );
          return;
        }

        setChildren(babies || []);
        if (babies && babies.length > 0) {
          setSelectedChild(babies[0]);
        }
      } else {
        console.error("Aucun utilisateur connecté.");
      }
    };

    getBabies();
  }, []);

  const menuItems = [
    { title: "Comment vas bébé ?", icon: "📝", screen: "BabyInfo" },
    { title: "Données", icon: "📈", screen: "Data" },
    { title: "Je viens voir bébé", icon: "📅", screen: "Appointment" },
    { title: "Album photo", icon: "📷" },
    { title: "Contacter l'infirmière", icon: "📞", screen: "NurseContact" },
  ];

  const renderMenuItem = (item: {
    title: string;
    icon: string;
    screen?: string;
  }) => (
    <TouchableOpacity
      style={styles.menuButton}
      key={item.title}
      onPress={() => {
        if (item.screen && selectedChild) {
          navigation.navigate(item.screen, { baby_id: selectedChild.id });
        }
      }}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuText}>{item.title}</Text>
      <Text style={styles.arrow}>➔</Text>
    </TouchableOpacity>
  );

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const selectChild = (child: Baby) => {
    setSelectedChild(child);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/form.png")}
        style={styles.topImage}
        blurRadius={0.8}
      />
      <Image
        source={require("../assets/form.png")}
        style={styles.botImage}
        blurRadius={0.8}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Bonjour, {userName}</Text>
          <View style={styles.childGroup}>
            <Text style={styles.child}>Enfant</Text>
            <TouchableOpacity style={styles.customPicker} onPress={openModal}>
              <Text style={styles.customPickerText}>
                {selectedChild
                  ? selectedChild.first_name
                  : "Sélectionnez un enfant"}
              </Text>
              <Image source={require("../assets/Down_arrow.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.locationGroup}>
            <Image
              style={styles.locationImage}
              source={require("../assets/icons/hopital.png")}
            />
            <Text style={styles.location}>Centre hospitalier de Lens</Text>
          </View>
          <Text style={styles.status}>
            {selectedChild
              ? `Votre enfant ${selectedChild.first_name} est actuellement réveillé !`
              : "Sélectionnez un enfant pour afficher les informations"}
          </Text>
        </View>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.modalOption}
                  onPress={() => selectChild(child)}
                >
                  <Text style={styles.modalOptionText}>{child.first_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    backgroundColor: "#274C86",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    padding: 20,
    marginBottom: 20,
    height: Platform.OS === "ios" ? 100 : 130,
  },
  subHeader: {},
  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  childGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    transform: [{ translateY: 20 }],
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "80%",
  },
  child: {
    color: "#000000",
    fontSize: 16,
    marginRight: 5,
    alignItems: "flex-start",
  },
  customPicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#274C86",
  },
  customPickerText: {
    fontSize: 16,
    color: "#000000",
    height: 20,
  },
  location: {
    color: "#6F6F6F",
    fontSize: 16,
    marginBottom: 5,
  },
  locationGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 16,
    marginVertical: 10,
  },
  locationImage: {
    width: 30,
    height: 30,
    transform: [{ translateY: -3 }],
  },
  status: {
    color: "#6F6F6F",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    width: "80%",
    alignSelf: "center",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  modalOptionText: {
    fontSize: 18,
    color: "#274C86",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#274C86",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
