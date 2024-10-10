import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { supabase } from "../utils/supabase";

export default function ManagerAppointment() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointment")
        .select("baby_id, visit_date, baby:baby_id(first_name, last_name)")
        .order("visit_date", { ascending: true });

      if (error) {
        console.error(
          "Erreur lors de la récupération des rendez-vous :",
          error
        );
      } else {
        const groupedData = groupByDate(data);
        setAppointments(groupedData);
      }
    };

    fetchAppointments();
  }, []);

  const groupByDate = (data: any[]) => {
    return data.reduce((acc: any, curr) => {
      const date = new Date(curr.visit_date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(curr);
      return acc;
    }, {});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(appointments).map((date, index) => (
        <View key={index} style={styles.daySection}>
          <Text style={styles.sectionTitle}>{date}</Text>
          {appointments[date].map((appt: any, idx: number) => (
            <View key={idx} style={styles.appointmentCard}>
              <Text style={styles.babyName}>
                👶 {appt.baby.first_name} {appt.baby.last_name}
              </Text>
              <Text style={styles.visitTime}>
                🕒{" "}
                {new Date(appt.visit_date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </View>
      ))}
      {Object.keys(appointments).length === 0 && (
        <Text style={styles.noAppointments}>Aucun rendez-vous à venir</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  daySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#274C86",
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  babyName: {
    fontSize: 18,
    color: "#274C86",
    fontWeight: "bold",
  },
  visitTime: {
    fontSize: 16,
    color: "#6A6A6A",
  },
  noAppointments: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 20,
  },
});
