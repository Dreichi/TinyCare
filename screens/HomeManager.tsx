import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function HomeManager({ navigation }: any) {
  const [userName, setUserName] = useState("utilisateur");
  const menuItems = [
    { title: "Liste Enfants", icon: "👶", screen: "ChildList" },
    { title: "Rendez-vous", icon: "📅", screen: "ManagerAppointment" },
    { title: "Messages", icon: "⚠️", screen: "ChatScreen" },
  ];

  useEffect(() => {
    const getInfo = async () => {
      const user = await supabase.auth.getUser();

      if (user) {
        const userId = user.data.user?.id;

        const { data } = await supabase
          .from("users")
          .select("name")
          .eq("id", userId)
          .single();

        setUserName(data?.name);
      }
    };
    getInfo();
  });

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      style={styles.menuButton}
      key={item.title}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuText}>{item.title}</Text>
      <Text style={styles.arrow}>➔</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.greeting}>👋 Bonjour, {userName}</Text>
        </View>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
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
