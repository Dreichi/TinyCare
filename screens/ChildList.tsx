import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  Alert,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm from "react-native-simple-radio-button";
import BottomSheet from "@gorhom/bottom-sheet";

export default function ChildList() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [newChild, setNewChild] = useState({
    first_name: "",
    last_name: "",
    birth_date: new Date(),
    gender: "",
  });
  const [newPostDescription, setNewPostDescription] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [nurseId, setNurseId] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    fetchChildren();
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setNurseId(user.id);
    }
  };

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase.from("baby").select("*");
      if (error) throw error;
      setChildren(data);
    } catch (error) {
      console.error("Error fetching children: ", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = dayjs();
    const birth = dayjs(birthDate);
    const weeks = today.diff(birth, "week");
    if (weeks <= 30) {
      return `${weeks} semaines`;
    }
    const months = today.diff(birth, "month");
    if (months < 12) {
      return `${months} mois`;
    }
    const years = today.diff(birth, "year");
    return `${years} ans`;
  };

  const handleAddChild = async () => {
    try {
      const { data, error } = await supabase.from("baby").insert([
        {
          ...newChild,
          birth_date: newChild.birth_date.toISOString().split("T")[0],
        },
      ]);
      if (error) throw error;
      if (data) {
        setChildren([...children, data[0]]);
      }
      setIsModalVisible(false);
      setNewChild({
        first_name: "",
        last_name: "",
        birth_date: new Date(),
        gender: "",
      });
      fetchChildren();
    } catch (error) {
      console.error("Error adding child: ", error);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer cet enfant ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("baby")
                .delete()
                .eq("id", childId);
              if (error) throw error;
              setChildren(children.filter((child) => child.id !== childId));
              bottomSheetRef.current?.close();
            } catch (error) {
              console.error("Error deleting child: ", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddPost = async () => {
    try {
      if (!nurseId || !selectedChildId) {
        console.error("Erreur : ID de l'infirmière ou de l'enfant non trouvé.");
        return;
      }

      const { data, error } = await supabase.from("post").insert([
        {
          date: new Date().toISOString(),
          description: newPostDescription,
          baby_id: selectedChildId,
          nurse_id: nurseId,
        },
      ]);
      if (error) throw error;
      setIsPostModalVisible(false);
      setNewPostDescription("");
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const ChildDetailsBottomSheet = () => (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["50%", "35%"]}
      enablePanDownToClose={true}
      onClose={() => setSelectedChild(null)}
    >
      <View style={styles.bottomSheetContainer}>
        {selectedChild && (
          <>
            <Text style={styles.modalTitle}>Détails de l'enfant</Text>
            <Text style={styles.drawerText}>
              Nom: {selectedChild.last_name} {selectedChild.first_name}
            </Text>
            <Text style={styles.drawerText}>
              Âge: {calculateAge(selectedChild.birth_date)}
            </Text>
            <Text style={styles.drawerText}>
              Genre: {selectedChild.gender === "female" ? "Fille" : "Garçon"}
            </Text>

            <TouchableOpacity
              style={styles.addPostButton}
              onPress={() => {
                setSelectedChildId(selectedChild.id);
                setIsPostModalVisible(true);
              }}
            >
              <Text style={styles.addPostButtonText}>Ajouter un post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteChild(selectedChild.id)}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => bottomSheetRef.current?.close()}
            >
              <Text style={styles.cancelButtonText}>Fermer</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </BottomSheet>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>👦 Liste des enfants</Text>
        </View>
        <Text style={styles.childCount}>
          {children.length} enfants dans la liste
        </Text>
        {loading ? (
          <Text>Chargement...</Text>
        ) : (
          <View style={styles.childListContainer}>
            {children.map((child) => (
              <TouchableOpacity
                style={styles.childButton}
                key={child.id}
                onPress={() => {
                  setSelectedChild(child);
                  setSelectedChildId(child.id);
                  bottomSheetRef.current?.expand();
                }}
              >
                <Text style={styles.childIcon}>
                  {child.gender === "female" ? "👧" : "👦"}
                </Text>
                <Text style={styles.childText}>
                  {child.last_name} {child.first_name} -{" "}
                  {calculateAge(child.birth_date)}
                </Text>
                <Text style={styles.arrow}>➔</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Ajouter un enfant</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un enfant</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={newChild.first_name}
              onChangeText={(text) =>
                setNewChild({ ...newChild, first_name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={newChild.last_name}
              onChangeText={(text) =>
                setNewChild({ ...newChild, last_name: text })
              }
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>{dayjs(newChild.birth_date).format("YYYY-MM-DD")}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newChild.birth_date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewChild({ ...newChild, birth_date: selectedDate });
                  }
                }}
              />
            )}
            <RadioForm
              radio_props={[
                { label: "Garçon", value: "male" },
                { label: "Fille", value: "female" },
              ]}
              initial={-1}
              onPress={(value: any) =>
                setNewChild({ ...newChild, gender: value })
              }
              formHorizontal={true}
              labelHorizontal={true}
              buttonColor={"#274C86"}
              selectedButtonColor={"#274C86"}
              labelStyle={{ marginRight: 10, fontSize: 16, color: "#6F6F6F" }}
              style={{ marginBottom: 20 }}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddChild}
            >
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPostModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un post</Text>
            <TextInput
              style={styles.input}
              placeholder="Description du post"
              value={newPostDescription}
              onChangeText={(text) => setNewPostDescription(text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddPost}>
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsPostModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChildDetailsBottomSheet />
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
  childCount: {
    fontSize: 16,
    color: "#6F6F6F",
    textAlign: "center",
    marginBottom: 16,
  },
  childListContainer: {
    paddingHorizontal: 32,
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
  childButton: {
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
  childText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6F6F6F",
    flex: 1,
    marginLeft: 10,
  },
  childIcon: {
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
  addButton: {
    backgroundColor: "#274C86",
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#274C86",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#274C86",
    fontSize: 16,
    textAlign: "center",
  },
  drawerText: {
    fontSize: 18,
    color: "#6F6F6F",
    marginBottom: 10,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 150,
    alignSelf: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  bottomSheetContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addPostButton: {
    backgroundColor: "#274C86",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: "center",
  },
  addPostButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
