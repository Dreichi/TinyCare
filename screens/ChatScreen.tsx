import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { supabase } from "../utils/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";

interface Message {
  id: number;
  content: string;
  created_at: string;
  sender_id: string;
  conversation_id: string;
}

interface Profile {
  id: string;
  name: string;
  role: string;
}

type RootStackParamList = {
  ChatScreen: { conversationId: string; otherUserName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;

export default function ChatScreen({ route, navigation }: Props) {
  const { conversationId, otherUserName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    navigation.setOptions({
      title: otherUserName,
    });
    fetchProfile();
    fetchMessages();

    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const fetchProfile = async () => {
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (userId) {
      const { data: profileData, error } = await supabase
        .from("users")
        .select("id, name, role")
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

  const fetchMessages = async () => {
    setLoading(true);
    const { data: messagesData, error } = await supabase
      .from("messages")
      .select("id, content, created_at, sender_id, conversation_id")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch messages:", error.message);
    } else {
      setMessages(messagesData || []);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: profile?.id,
      conversation_id: conversationId,
    });

    if (error) {
      console.error("Failed to send message:", error.message);
    } else {
      setNewMessage("");
    }
    setLoading(false);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#114187" />
            ) : (
              <View style={styles.messagesSection}>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <View
                      key={message.id}
                      style={
                        message.sender_id === profile?.id
                          ? [styles.messageContainer, styles.sentMessage]
                          : [styles.messageContainer, styles.receivedMessage]
                      }
                    >
                      <Text
                        style={
                          message.sender_id === profile?.id
                            ? styles.sentMessageText
                            : styles.receivedMessageText
                        }
                      >
                        {message.content}
                      </Text>
                      <Text
                        style={
                          message.sender_id === profile?.id
                            ? styles.sentMessageDate
                            : styles.receivedMessageDate
                        }
                      >
                        {formatDate(message.created_at)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noMessagesText}>
                    Aucun message pour l'instant.
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
          <View style={styles.send}>
            <TextInput
              style={styles.messageInput}
              placeholder="Envoyer un message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={loading}
            >
              <Icon name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#F2F0FF",
  },
  messagesSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#114187",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
  },
  sentMessageText: {
    fontSize: 16,
    color: "#FFF",
  },
  receivedMessageText: {
    fontSize: 16,
    color: "#000",
  },
  sentMessageDate: {
    fontSize: 12,
    color: "#FFF",
    textAlign: "right",
  },
  receivedMessageDate: {
    fontSize: 12,
    color: "#000",
    textAlign: "right",
  },
  noMessagesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#FFF",
  },
  sendButton: {
    backgroundColor: "#114187",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  send: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFF",
  },
});
