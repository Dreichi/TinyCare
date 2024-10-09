import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../utils/supabase";

interface BabyInfoProps {
  route: {
    params: {
      baby_id: number;
    };
  };
}

export default function BabyInfo({ route }: BabyInfoProps) {
  const { baby_id } = route.params;
  const [babyInfo, setBabyInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBabyInfo = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("baby_id", baby_id)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) console.error("Error fetching data:", error);
      else setBabyInfo(data);
    };

    fetchBabyInfo();
  }, [baby_id]);

  if (!babyInfo) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {new Date(babyInfo.date).toLocaleDateString()}
      </Text>
      <View style={styles.card}>
        <Text style={styles.nurse}>Soignant : {babyInfo.nurse_name}</Text>
        <Text style={styles.infoDate}>
          {new Date(babyInfo.date).toLocaleDateString()}
        </Text>
        <Text style={styles.infoText}>{babyInfo.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F3FF",
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  date: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  nurse: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#274C86",
    marginBottom: 10,
  },
  infoDate: {
    fontSize: 12,
    color: "#6A6A6A",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
});
