import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
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
  const [babyInfo, setBabyInfo] = useState<any[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  const currentDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);

  useEffect(() => {
    const fetchBabyInfo = async () => {
      const { data: postsData, error: postsError } = await supabase
        .from("post")
        .select("*")
        .eq("baby_id", baby_id)
        .order("date", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts data:", postsError);
        return;
      }

      const nurseIds = [...new Set(postsData.map((post) => post.nurse_id))];

      const { data: nursesData, error: nursesError } = await supabase
        .from("users")
        .select("id, name")
        .in("id", nurseIds);

      if (nursesError) {
        console.error("Error fetching nurses data:", nursesError);
        return;
      }

      const nursesMap = nursesData.reduce((acc, nurse) => {
        acc[nurse.id] = nurse.name;
        return acc;
      }, {});

      const postsWithNurses = postsData.map((post) => ({
        ...post,
        nurse_name: nursesMap[post.nurse_id] || "Inconnu",
      }));

      setBabyInfo(postsWithNurses);
      if (postsWithNurses.length > 0) {
        setExpandedMessage(postsWithNurses[0].id);
      }
    };

    fetchBabyInfo();
  }, [baby_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toDateString() === currentDate.toDateString();
  };

  const isYesterday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toDateString() === yesterday.toDateString();
  };

  const todayMessages = babyInfo.filter((info) => isToday(info.date));
  const yesterdayMessages = babyInfo.filter((info) => isYesterday(info.date));
  const olderMessages = babyInfo.filter(
    (info) => !isToday(info.date) && !isYesterday(info.date)
  );

  const toggleExpand = (id: number) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (babyInfo.length === 0) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

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
      <View style={styles.header}>
        <Text style={styles.greeting}>👶 Comment va bébé ?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.currentDate}>
          {formatDate(currentDate.toISOString())}
        </Text>

        {todayMessages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Aujourd'hui</Text>
            {todayMessages.map((info) => (
              <TouchableOpacity
                key={info.id}
                onPress={() => toggleExpand(info.id)}
              >
                {expandedMessage !== info.id && (
                  <View style={styles.closedCard}>
                    <View style={styles.blueSquare}></View>
                    <View style={styles.truncatedContent}>
                      <Text style={styles.truncatedText}>
                        {truncateText(info.description, 30)}
                      </Text>
                    </View>
                  </View>
                )}

                {expandedMessage === info.id && (
                  <View style={styles.card}>
                    <View style={styles.nurseHeader}>
                      <Text style={styles.nurse}>
                        Soignant : {info.nurse_name}
                      </Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.infoDate}>
                        {new Date(info.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.infoText}>{info.description}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Messages d'hier */}
        {yesterdayMessages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Hier</Text>
            {yesterdayMessages.map((info) => (
              <TouchableOpacity
                key={info.id}
                onPress={() => toggleExpand(info.id)}
              >
                {/* Affichage rétréci si le message n'est pas ouvert */}
                {expandedMessage !== info.id && (
                  <View style={styles.closedCard}>
                    <View style={styles.blueSquare}></View>
                    <View style={styles.truncatedContent}>
                      <Text style={styles.truncatedText}>
                        {truncateText(info.description, 30)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Affichage du contenu complet si le message est ouvert */}
                {expandedMessage === info.id && (
                  <View style={styles.card}>
                    <View style={styles.nurseHeader}>
                      <Text style={styles.nurse}>
                        Soignant : {info.nurse_name}
                      </Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.infoDate}>
                        {new Date(info.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.infoText}>{info.description}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Anciens messages */}
        {olderMessages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Anciens messages</Text>
            {olderMessages.map((info) => (
              <TouchableOpacity
                key={info.id}
                onPress={() => toggleExpand(info.id)}
              >
                {/* Affichage rétréci si le message n'est pas ouvert */}
                {expandedMessage !== info.id && (
                  <View style={styles.closedCard}>
                    <View style={styles.blueSquare}></View>
                    <View style={styles.truncatedContent}>
                      <Text style={styles.truncatedText}>
                        {truncateText(info.description, 30)}
                      </Text>
                    </View>
                  </View>
                )}

                {expandedMessage === info.id && (
                  <View style={styles.card}>
                    <View style={styles.nurseHeader}>
                      <Text style={styles.nurse}>
                        Soignant : {info.nurse_name}
                      </Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.infoDate}>
                        {new Date(info.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.infoText}>{info.description}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
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
  scrollViewContent: {
    paddingBottom: 80,
  },
  currentDate: {
    fontSize: 18,
    textAlign: "center",
    color: "#6A6A6A",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#585858",
    // fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
  },
  closedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    // padding: 10,
    borderWidth: 1,
    borderColor: "#797979",
  },
  blueSquare: {
    width: 40,
    height: 40,
    backgroundColor: "#274C86",
    borderRadius: 9,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: "#797979",
  },
  truncatedContent: {
    flex: 1,
  },
  truncatedText: {
    color: "#4A4A4A",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#797979",
  },
  nurseHeader: {
    backgroundColor: "#274C86",
    padding: 10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  nurse: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardContent: {
    padding: 15,
  },
  infoDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A6A6A",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
});
