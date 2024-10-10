import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase";
import CalendarPicker from "react-native-calendar-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Appointment: { baby_id: number };
};

export default function Appointment() {
  const route = useRoute<RouteProp<RootStackParamList, "Appointment">>();

  const [parentId, setParentId] = useState<number | null>(null);
  const baby_id = route.params?.baby_id || null;
  const [babyName, setBabyName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  if (!baby_id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Erreur : ID du bébé non fourni ou invalide.
        </Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchParentId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setParentId(user?.id || null);
    };

    const fetchBabyName = async () => {
      const { data, error } = await supabase
        .from("baby")
        .select("first_name")
        .eq("id", baby_id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du nom du bébé :", error);
        setBabyName("Inconnu");
      } else {
        setBabyName(data.first_name);
      }
    };

    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointment")
        .select("*")
        .eq("baby_id", baby_id)
        .order("visit_date", { ascending: true });

      if (error) {
        console.error(
          "Erreur lors de la récupération des rendez-vous :",
          error
        );
      } else {
        setAppointments(data);
      }
    };

    fetchParentId();
    fetchBabyName();
    fetchAppointments();
  }, [baby_id]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date.toISOString().split("T")[0]);
      setSelectedTime(null);
      setTimePickerVisibility(true);
    } else {
      setSelectedDate(null);
    }
  };

  const handleConfirm = (time: Date) => {
    setSelectedTime(time);
    setTimePickerVisibility(false);
  };

  const handleAddAppointment = async () => {
    if (!selectedDate || !selectedTime || !parentId) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner une date, une heure, et assurez-vous d'être connecté."
      );
      return;
    }

    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());

    const { data, error } = await supabase.from("appointment").insert([
      {
        baby_id: baby_id,
        parent_id: parentId,
        visit_date: combinedDate.toISOString(),
      },
    ]);

    if (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création du rendez-vous."
      );
      console.error("Erreur lors de l'ajout du rendez-vous :", error);
    } else {
      Alert.alert("Succès", "Rendez-vous ajouté avec succès.");
      setAppointments([...appointments, { visit_date: combinedDate }]);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce rendez-vous ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("appointment")
              .delete()
              .eq("id", appointmentId);

            if (error) {
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la suppression du rendez-vous."
              );
              console.error(
                "Erreur lors de la suppression du rendez-vous :",
                error
              );
            } else {
              Alert.alert("Succès", "Rendez-vous annulé avec succès.");
              setAppointments(
                appointments.filter((appt) => appt.id !== appointmentId)
              );
            }
          },
        },
      ]
    );
  };

  const currentDate = new Date();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
      <View style={styles.header}>
        <Text style={styles.greeting}>📅 Je viens voir bébé</Text>
      </View>

      <Text style={styles.title}>Prendre rendez-vous pour {babyName}</Text>
      <Text style={styles.currentDate}>
        {formatDate(currentDate.toISOString())}
      </Text>

      <CalendarPicker
        onDateChange={handleDateChange}
        selectedDayColor="#274C86"
        selectedDayTextColor="#FFFFFF"
        todayBackgroundColor="#E6F7FF"
        textStyle={{
          color: "#274C86",
        }}
        previousTitle="◀"
        nextTitle="▶"
        previousTitleStyle={styles.navButton}
        nextTitleStyle={styles.navButton}
        todayTextStyle={{ fontWeight: "bold" }}
        width={350}
        months={[
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ]}
        weekdays={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setTimePickerVisibility(false)}
        is24Hour={true}
      />

      {selectedDate && selectedTime && (
        <View>
          <Text style={styles.selectedDate}>
            Date sélectionnée :{" "}
            <Text style={styles.date}>
              {new Date(selectedDate).toLocaleDateString("fr-FR")}
            </Text>
          </Text>
          <Text style={styles.selectedHour}>
            Heure sélectionnée :{" "}
            <Text style={styles.hour}>
              {selectedTime.toLocaleTimeString("fr-FR")}
            </Text>
          </Text>
          <View>
            <TouchableOpacity onPress={handleAddAppointment}>
              <Text style={styles.rdvBtn}>Ajouter le rendez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>Mes rendez-vous</Text>
      <View style={styles.appointmentList}>
        {appointments.map((appt, index) => (
          <View key={index} style={styles.appointmentCard}>
            <Text style={styles.appointmentText}>
              Date : {new Date(appt.visit_date).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.appointmentText}>
              Heure : {new Date(appt.visit_date).toLocaleTimeString("fr-FR")}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteAppointment(appt.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        {appointments.length === 0 && (
          <Text style={styles.noAppointments}>
            Aucun rendez-vous pour le moment
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

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
    height: Platform.OS === "ios" ? 100 : 130,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  currentDate: {
    fontSize: 18,
    textAlign: "center",
    color: "#6A6A6A",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#274C86",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#274C86",
    textAlign: "center",
    marginTop: 20,
  },
  navButton: {
    fontSize: 18,
    color: "#274C86",
    fontWeight: "bold",
  },
  rdvBtn: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 10,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "rgba(17, 65, 135, 1)",
    borderRadius: 50,
    height: 50,
    justifyContent: "center",
    maxWidth: 200,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  selectedDate: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  selectedHour: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginBottom: 20,
  },
  hour: {
    fontSize: 16,
    color: "#3060A6",
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    color: "#3060A6",
    fontWeight: "bold",
  },
  appointmentList: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#797979",
  },
  appointmentText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
  noAppointments: {
    fontSize: 14,
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
