import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase";

type User = {
  id: string;
  username: string;
};

type Message = {
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  user1: User;
  user2: User;
  lastMessage?: Message;
};

type Profile = {
  id: string;
  name: string;
};

type MessageScreenProps = {
  route: any;
  navigation: any;
};

export default function MessageScreen({
  route,
  navigation,
}: MessageScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({} as Profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile.id) {
      fetchConversations();
    }
  }, [profile.id]);

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
        console.error("Failed to fetch profile data:", error.message);
      } else {
        setProfile(profileData);
      }
    } else {
      console.error("No user is logged in");
    }
  };

  const fetchConversations = async () => {
    setLoading(true);

    const { data: conversationsData, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        user1: user1_id ( id, name ),
        user2: user2_id ( id, name ),
        last_message
      `
      )
      .or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`);

    if (error) {
      console.error("Failed to fetch conversations:", error.message);
    } else {
      const conversationWithMessages = await Promise.all(
        conversationsData.map(async (conversation) => {
          const { data: lastMessageData } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conversation.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conversation,
            lastMessage: lastMessageData
              ? {
                  content: lastMessageData.content,
                  createdAt: lastMessageData.created_at,
                }
              : undefined,
          };
        })
      );
      setConversations(conversationWithMessages);
    }
    setLoading(false);
  };

  const handleOpenConversation = (conversation: Conversation) => {
    const otherUserName =
      conversation.user1.id === profile.id
        ? conversation.user2.name
        : conversation.user1.name;

    navigation.navigate("ChatScreen", {
      conversationId: conversation.id,
      otherUserName: otherUserName,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>💬 Contacter le soignant</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#114187" />
        ) : (
          <View style={styles.conversationsSection}>
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={[
                    styles.conversationContainer,
                    index === 0 && styles.firstConversationContainer,
                  ]}
                  onPress={() => handleOpenConversation(conversation)}
                >
                  <View style={styles.customFlex}>
                    <Text style={styles.conversationName}>
                      {conversation.user1.id === profile.id
                        ? conversation.user2.name
                        : conversation.user1.name}
                    </Text>
                    <Text
                      style={styles.lastMessage}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {conversation.lastMessage?.content ||
                        "Pas encore de message..."}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noConversationsText}>
                Aucune conversation pour l'instant.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === "android" ? 32 : 0,
    flex: 1,
  },
  conversationTitle: {
    marginBottom: 16,
    fontSize: 28,
    fontFamily: "Palanquin_600SemiBold",
    textAlign: "center",
    color: "#347355",
    textTransform: "uppercase",
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
  conversationsSection: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    paddingHorizontal: 32,
  },
  customFlex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
  },
  conversationContainer: {
    padding: 10,
    height: 70,
    borderBottomWidth: 1,
    borderColor: "grey",
    width: "100%",
  },
  firstConversationContainer: {
    borderTopWidth: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
  noConversationsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
