import React, { useState } from "react";
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

export default function HomeScreen({ navigation }: any) {
  const [selectedChild, setSelectedChild] = useState("Enfant 1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const children = ["Aymeric", "Jean-Christophe", "Damien", "Jack"];

  const menuItems = [
    { title: "Comment vas bébé ?", icon: "📝", screen: "BabyInfo", id: 1 },
    { title: "Croissance", icon: "📈" },
    { title: "Je viens voir bébé", icon: "📅", screen: "Appointment", id: 1 },
    { title: "Album photo", icon: "📷" },
    { title: "Contacter l'infirmière", icon: "📞" },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      style={styles.menuButton}
      key={item.title}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen, { baby_id: item.id });
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

  const selectChild = (child: string) => {
    setSelectedChild(child);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Bonjour, utilisateur</Text>
          <View style={styles.childGroup}>
            <Text style={styles.child}>Enfant</Text>
            <TouchableOpacity style={styles.customPicker} onPress={openModal}>
              <Text style={styles.customPickerText}>{selectedChild}</Text>
              <Image source={require("../assets/Down_arrow.png")}></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.locationGroup}>
            <Image
              style={styles.locationImage}
              source={require("../assets/icons/hopital.png")}
            ></Image>
            <Text style={styles.location}>Centre hospitalier de Lens</Text>
          </View>
          <Text style={styles.status}>
            Votre enfant {selectedChild} est actuellement réveillé&nbsp;!
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
                  key={child}
                  style={styles.modalOption}
                  onPress={() => selectChild(child)}
                >
                  <Text style={styles.modalOptionText}>{child}</Text>
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
    // padding: 32,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#274C86",
  },
  menuIcon: {
    backgroundColor: "#A2BFE9",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#797979",
    overflow: "hidden",
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
