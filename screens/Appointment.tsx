import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prendre rendez-vous pour {babyName}</Text>

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
            {new Date(selectedDate).toLocaleDateString("fr-FR")}
          </Text>
          <Text>
            Heure sélectionnée : {selectedTime.toLocaleTimeString("fr-FR")}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Ajouter un rendez-vous"
              onPress={handleAddAppointment}
            />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F3FF",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
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
  selectedDate: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
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
});
