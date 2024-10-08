// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import apiUrl from "../api";

// export default function PostScreen({
//   route,
//   navigation,
// }: {
//   route: any;
//   navigation: any;
// }) {
//   const { post } = route.params;
//   const [comments, setComments] = useState<any[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [commentsLoading, setCommentsLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [profile, setProfile] = useState<any>({});

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//     };
//     return new Date(dateString).toLocaleDateString("fr-FR", options);
//   };

//   useEffect(() => {
//     navigation.setOptions({
//       title: post.title,
//       headerRight: () =>
//         Number(profile.userRole) === 2 && post.isGardening ? (
//           <TouchableOpacity
//             onPress={handleGardening}
//             style={[styles.navButton, post.GardenedBy && styles.disabledButton]}
//             disabled={!!post.GardenedBy}
//           >
//             <Text style={styles.navButtonText}>
//               {post.GardenedBy ? "Déjà gardé" : "Prendre en charge"}
//             </Text>
//           </TouchableOpacity>
//         ) : null,
//     });
//     fetchComments();
//     fetchProfile();
//   }, [post.title, refreshKey, profile.userRole, post.isGardening]);

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

//   const fetchComments = async () => {
//     setCommentsLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const response = await axios.get(`${apiUrl}/answer/${post.id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.status === 200) {
//           setComments(response.data.answers || []);
//         } else {
//           console.error("Failed to fetch comments");
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     } finally {
//       setCommentsLoading(false);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) {
//       Alert.alert("Error", "Comment cannot be empty");
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const response = await axios.post(
//           `${apiUrl}/answer/create`,
//           {
//             content: newComment,
//             postedBy: profile.id,
//             answerOf: post.id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.status === 201) {
//           setNewComment("");
//           setRefreshKey((oldKey) => oldKey + 1);
//         } else {
//           console.error("Failed to add comment");
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDM = async () => {
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

//         if (response.status === 200 && response.data && response.data.data) {
//           const existingConversation = response.data.data.find(
//             (conversation: any) =>
//               (conversation.User1.id === profile.id &&
//                 conversation.User2.id === post.postedById) ||
//               (conversation.User1.id === post.postedById &&
//                 conversation.User2.id === profile.id)
//           );

//           const otherUserName = post.postedBy;

//           if (existingConversation) {
//             navigation.navigate("ChatScreen", {
//               conversationId: existingConversation.id,
//               otherUserName: otherUserName,
//             });
//           } else {
//             const newConversationResponse = await axios.post(
//               `${apiUrl}/conversations`,
//               {
//                 user1Id: profile.id,
//                 user2Id: post.postedById,
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//             if (newConversationResponse.status === 201) {
//               const newConversation = newConversationResponse.data.data;
//               navigation.navigate("ChatScreen", {
//                 conversationId: newConversation.id,
//                 otherUserName: otherUserName,
//               });
//             } else {
//               console.error("Failed to create conversation");
//             }
//           }
//         } else {
//           console.error(
//             "Failed to fetch conversations or invalid response format"
//           );
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error checking/creating conversation:", error);
//     }
//   };

//   const handleGardening = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const response = await axios.patch(
//           `${apiUrl}/posts/update`,
//           {
//             id: post.id,
//             GardenedBy: profile.id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.status === 200) {
//           Alert.alert(
//             "Success",
//             "Vous avez pris en charge ce post pour jardiner."
//           );
//           setRefreshKey((oldKey) => oldKey + 1);
//         } else {
//           console.error("Failed to take charge for gardening");
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error taking charge for gardening:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {post.image && (
//           <Image
//             source={{ uri: `data:image/png;base64,${post.image}` }}
//             style={styles.image}
//           />
//         )}
//         <Text style={styles.postedBy}>Posté par: {post.postedBy}</Text>
//         <Text style={styles.createdAt}>Le {formatDate(post.createdAt)}</Text>
//         <Text style={styles.content}>{post.content}</Text>

//         {profile.id !== post.postedById && (
//           <TouchableOpacity style={styles.dmButton} onPress={handleDM}>
//             <Text style={styles.dmButtonText}>Message</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//                 onPress={handleGardening}
//                 disabled={!!post.GardenedBy}
//                 style={styles.addButton}
//                 >
//                   <Text style={styles.addButtonText}>
//                     {post.GardenedBy ? "Déjà gardé" : "Prendre en charge"}
//                   </Text>
//                 </TouchableOpacity>

//         <TextInput
//           style={styles.commentInput}
//           placeholder="Ajouter un commentaire..."
//           value={newComment}
//           onChangeText={setNewComment}
//         />

//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={handleAddComment}
//           disabled={loading}
//         >
//           <Text style={styles.addButtonText}>
//             {loading ? "Posting..." : "Ajouter"}
//           </Text>
//         </TouchableOpacity>

//         {commentsLoading ? (
//           <ActivityIndicator size="large" color="#347355" />
//         ) : (
//           <View style={styles.commentsSection}>
//             {comments.length > 0 ? (
//               comments.map(
//                 (comment: {
//                   id: number;
//                   postedByUser: { username: string };
//                   content: string;
//                   createdAt: string;
//                 }) => (
//                   <View key={comment.id} style={styles.commentContainer}>
//                     <Text style={styles.commentAuthor}>
//                       {comment.postedByUser.username}
//                     </Text>
//                     <Text style={styles.commentContent}>{comment.content}</Text>
//                     <Text style={styles.commentDate}>
//                       {formatDate(comment.createdAt)}
//                     </Text>
//                   </View>
//                 )
//               )
//             ) : (
//               <Text style={styles.noCommentsText}>
//                 Aucun commentaire pour l'instant.
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
//     flex: 1,
//     padding: 20,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   postedBy: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   createdAt: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   content: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   dmButton: {
//     backgroundColor: "#347355",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   dmButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   navButton: {
//     backgroundColor: "#347355",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginRight: 10,
//   },
//   navButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   disabledButton: {
//     backgroundColor: "#aaa",
//   },
//   commentInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   addButton: {
//     backgroundColor: "#347355",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   addButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   commentsSection: {
//     marginTop: 20,
//   },
//   commentContainer: {
//     marginBottom: 15,
//   },
//   commentAuthor: {
//     fontWeight: "bold",
//   },
//   commentContent: {
//     marginVertical: 5,
//   },
//   commentDate: {
//     fontSize: 12,
//     color: "gray",
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: "gray",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });
