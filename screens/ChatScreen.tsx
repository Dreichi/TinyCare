import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import FormData from "form-data";
import Modal from "react-native-modal";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  conversationId: string;
  imageUrl?: string;
}

interface Profile {
  id: number;
  username: string;
  userRole: string;
}

type RootStackParamList = {
  ChatScreen: { conversationId: number; otherUserName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;

export default function ChatScreen({ route, navigation }: Props) {
  const { conversationId, otherUserName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const userRole = profile?.userRole;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reportDay, setReportDay] = useState("");
  const [reportTimes, setReportTimes] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedReportImage, setSelectedReportImage] = useState<string | null>(
    null
  );

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    navigation.setOptions({
      title: otherUserName,
      headerRight: () =>
        Number(userRole) === 2 && (
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={{ marginRight: 10 }}
          >
            <Text style={{ color: "#347355", fontSize: 16 }}>
              Faire un rapport
            </Text>
          </TouchableOpacity>
        ),
    });
    // fetchProfile();
  }, [otherUserName, userRole]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: mediaLibraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();

        if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
          alert(
            "Sorry, we need camera, media library and location permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (profile?.id) {
  //     fetchMessages();

  //     const socket = new WebSocket(`${apiUrl.replace(/^http/, "ws")}`);

  //     socket.onopen = () => {
  //       console.log("WebSocket connected");
  //       socket.send(
  //         JSON.stringify({
  //           type: "join_conversation",
  //           conversationId,
  //         })
  //       );
  //       console.log(`Joined conversation ${conversationId}`);
  //     };

  //     socket.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       console.log("New message:", message);
  //       if (message.conversationId.toString() === conversationId.toString()) {
  //         setMessages((prevMessages) => [...prevMessages, message]);
  //       }
  //     };

  //     socket.onclose = (event) => {
  //       console.log("WebSocket disconnected:", event.reason);
  //     };

  //     socket.onerror = (error) => {
  //       console.log("WebSocket error:", error);
  //     };

  //     return () => {
  //       socket.close();
  //       console.log(
  //         `Disconnected from WebSocket for conversation ${conversationId}`
  //       );
  //     };
  //   }
  //   console.log(`Profile ID: ${profile?.id}`);
  // }, [profile?.id, conversationId, profile]);

  useEffect(() => {
    console.log(`profile username: ${profile?.username}`);
    console.log(`userRole: ${profile?.userRole}`);
  }, [profile?.userRole]);
  useEffect(() => {
    // Ensure messages are loaded before scrolling to end
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // const fetchProfile = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const response = await axios.get(`${apiUrl}/users/profile`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (response.status === 200) {
  //         setProfile(response.data.data);
  //       } else {
  //         console.error("Failed to fetch profile data");
  //       }
  //     } else {
  //       console.error("No token found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile data:", error);
  //   }
  // };

  // const fetchMessages = async () => {
  //   setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const response = await axios.get(
  //         `${apiUrl}/conversations/${conversationId}/messages`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if (response.status === 200) {
  //         setMessages(response.data.data);
  //         setTimeout(() => {
  //           scrollViewRef.current?.scrollToEnd({ animated: false });
  //         }, 100);
  //       } else {
  //         console.error("Failed to fetch messages");
  //       }
  //     } else {
  //       console.error("No token found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const createImage = async (formData: any) => {
    try {
      const response = await axios({
        method: "post",
        url: "https://api.imgur.com/3/image",
        data: formData,
        headers: {
          Authorization: `Client-ID 41e0d680636e63d`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data.link;
    } catch (error) {
      console.log(error);
      throw new Error("Image upload failed");
    }
  };

  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() && !selectedImage) {
  //     Alert.alert("Error", "Message or image cannot be empty");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       let imageUrl = null;
  //       if (selectedImage) {
  //         const formData = new FormData();
  //         formData.append("image", {
  //           uri: selectedImage,
  //           name: "image.jpg",
  //           type: "image/jpeg",
  //         });

  //         imageUrl = await createImage(formData);
  //       }

  //       const response = await axios.post(
  //         `${apiUrl}/messages`,
  //         {
  //           content: newMessage,
  //           imageUrl,
  //           senderId: profile?.id,
  //           conversationId,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.status === 201) {
  //         setNewMessage("");
  //         setSelectedImage(null);
  //         fetchMessages();
  //       } else {
  //         console.error("Failed to send message");
  //       }
  //     } else {
  //       console.error("No token found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSendReport = async () => {
  //   if (!reportDay.trim() || !reportTimes.trim() || !reportDescription.trim()) {
  //     Alert.alert("Error", "All fields must be filled out");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       let imageUrl = null;
  //       if (selectedReportImage) {
  //         const formData = new FormData();
  //         formData.append("image", {
  //           uri: selectedReportImage,
  //           name: "image.jpg",
  //           type: "image/jpeg",
  //         });

  //         imageUrl = await createImage(formData);
  //       }

  //       const content = `Rapport du ${reportDay}\nNombre de fois arrosé: ${reportTimes}\nDescription: ${reportDescription}`;
  //       const response = await axios.post(
  //         `${apiUrl}/messages`,
  //         {
  //           content,
  //           imageUrl,
  //           senderId: profile?.id,
  //           conversationId,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.status === 201) {
  //         setReportDay("");
  //         setReportTimes("");
  //         setReportDescription("");
  //         setSelectedReportImage(null);
  //         setIsModalVisible(false);
  //         fetchMessages();
  //       } else {
  //         console.error("Failed to send report");
  //       }
  //     } else {
  //       console.error("No token found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error sending report:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickReportImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedReportImage(result.assets[0].uri);
    }
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
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        {loading ? (
          <ActivityIndicator size="large" color="#347355" />
        ) : (
          <View style={styles.messagesSection}>
            {messages.length > 0 ? (
              messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.senderId === profile?.id
                      ? styles.sentMessage
                      : styles.receivedMessage,
                  ]}
                >
                  {message.imageUrl && (
                    <Image
                      source={{ uri: message.imageUrl }}
                      style={styles.messageImage}
                    />
                  )}
                  <Text style={styles.messageContent}>{message.content}</Text>
                  <Text style={styles.messageDate}>
                    {formatDate(message.createdAt)}
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
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageButton}
          >
            <Icon name="close-circle" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.send}>
        <TextInput
          style={styles.messageInput}
          placeholder="Envoyer un message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.clipIcon}>
          <Icon name="attach" size={24} color="#347355" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          // onPress={handleSendMessage}
          disabled={loading}
        >
          <Icon name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Faire un rapport</Text>
          <TextInput
            style={styles.input}
            placeholder="Jour"
            value={reportDay}
            onChangeText={setReportDay}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre de fois arrosé"
            value={reportTimes}
            onChangeText={setReportTimes}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={reportDescription}
            onChangeText={setReportDescription}
          />
          {selectedReportImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedReportImage }}
                style={styles.previewImage}
              />
              <TouchableOpacity
                onPress={() => setSelectedReportImage(null)}
                style={styles.removeImageButton}
              >
                <Icon name="close-circle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={pickReportImage} style={styles.clipIcon}>
            <Icon name="attach" size={24} color="#347355" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            // onPress={handleSendReport}
            disabled={loading}
          >
            <Text style={styles.modalButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#F5F5F5",
  },
  messagesSection: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
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
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  messageContent: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 12,
    color: "gray",
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
    backgroundColor: "#347355",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
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
  clipIcon: {
    margin: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  removeImageButton: {
    padding: 5,
  },
  reportButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#347355",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  reportButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#347355",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
