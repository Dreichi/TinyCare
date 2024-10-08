// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import apiUrl from "../api";

// type User = {
//   id: number;
//   username: string;
// };

// type Message = {
//   content: string;
//   createdAt: string;
// };

// type Conversation = {
//   id: number;
//   User1: User;
//   User2: User;
//   lastMessage?: Message;
// };

// type Profile = {
//   id: number;
//   username: string;
// };

// type MessageScreenProps = {
//   route: any;
//   navigation: any;
// };

// export default function MessageScreen({
//   route,
//   navigation,
// }: MessageScreenProps) {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({} as Profile);
//   const [unreadConversations, setUnreadConversations] = useState<number[]>([]);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     if (profile.id) {
//       fetchConversations();
//     }
//   }, [profile.id]);

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const response = await axios.get(`${apiUrl}/users/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.status === 200) {
//           setProfile(response.data.data);
//         } else {
//           console.error("Failed to fetch profile data");
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   const fetchConversations = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const response = await axios.get(
//           `${apiUrl}/conversations/${profile.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.status === 200) {
//           setConversations(response.data.data);
//         } else {
//           console.error("Failed to fetch conversations");
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenConversation = (conversation: Conversation) => {
//     const otherUserName =
//       conversation.User1.username === profile.username
//         ? conversation.User2.username
//         : conversation.User1.username;
//     navigation.navigate("ChatScreen", {
//       conversationId: conversation.id,
//       otherUserName: otherUserName,
//     });
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchConversations();
//     setRefreshing(false);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {loading ? (
//           <ActivityIndicator size="large" color="#347355" />
//         ) : (
//           <View style={styles.conversationsSection}>
//             <Text style={styles.conversationTitle}>Vos messages</Text>
//             {conversations.length > 0 ? (
//               conversations.map((conversation, index) => (
//                 <TouchableOpacity
//                   key={conversation.id}
//                   style={[
//                     styles.conversationContainer,
//                     index === 0 && styles.firstConversationContainer,
//                   ]}
//                   onPress={() => handleOpenConversation(conversation)}
//                 >
//                   <View style={styles.customFlex}>
//                     <Text style={styles.conversationName}>
//                       {conversation.User1.username === profile.username
//                         ? conversation.User2.username
//                         : conversation.User1.username}
//                     </Text>
//                     <Text
//                       style={styles.lastMessage}
//                       numberOfLines={2}
//                       ellipsizeMode="tail"
//                     >
//                       {conversation.lastMessage?.content || "No messages yet"}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text style={styles.noConversationsText}>
//                 Aucune conversation pour l'instant.
//               </Text>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: Platform.OS === "android" ? 32 : 0,
//     flex: 1,
//   },
//   conversationTitle: {
//     marginBottom: 16,
//     fontSize: 28,
//     fontFamily: "Montserrat_600SemiBold",
//     textAlign: "center",
//     color: "#347355",
//     textTransform: "uppercase",
//   },
//   conversationsSection: {
//     marginTop: 20,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 0,
//   },
//   customFlex: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     width: "100%",
//     alignContent: "flex-start",
//     alignItems: "flex-start",
//     gap: 4,
//   },
//   conversationContainer: {
//     padding: 10,
//     height: 70,
//     borderBottomWidth: 1,
//     borderColor: "grey",
//     width: "100%",
//   },
//   firstConversationContainer: {
//     borderTopWidth: 1,
//   },
//   conversationName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: "gray",
//   },
//   noConversationsText: {
//     fontSize: 16,
//     color: "gray",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });
