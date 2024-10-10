import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

interface Post {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
  image?: string;
  GardenedBy?: string;
}

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gardeningPosts, setGardeningPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [userId, setUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  //   useEffect(() => {
  //     let isMounted = true;

  //     const getProfile = async () => {
  //       try {
  //         const token = await AsyncStorage.getItem("token");
  //         if (token) {
  //           const response = await axios.get(`${apiUrl}/users/profile`, {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           });
  //           if (response.status === 200 && response.data && response.data.data) {
  //             if (isMounted) {
  //               const userData = response.data.data;
  //               if (userData.username) {
  //                 setUserId(userData.id);
  //                 setUsername(userData.username);
  //                 setUserRole(userData.userRole);
  //               } else {
  //                 console.error("Username not found in response.data.data");
  //               }
  //             }
  //           } else {
  //             console.error(
  //               "Failed to fetch profile data, status code:",
  //               response.status
  //             );
  //           }
  //         } else {
  //           console.error("No token found in AsyncStorage");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching profile data", error);
  //       }
  //     };

  //     getProfile();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, []);

  //   useEffect(() => {
  //     if (userId) {
  //       getUserPosts();
  //       if (userRole === 2) {
  //         getGardeningPosts();
  //       }
  //     }
  //   }, [userId, userRole]);

  //   const getUserPosts = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const response = await axios.get(`${apiUrl}/posts/user/${userId}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         if (response.status === 200 && response.data && response.data.posts) {
  //           const sortedPosts = response.data.posts.sort(
  //             (a: any, b: any) =>
  //               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //           );
  //           setPosts(sortedPosts);
  //         } else {
  //           console.error(
  //             "Failed to fetch posts data, status code:",
  //             response.status
  //           );
  //         }
  //       } else {
  //         console.error("No token found in AsyncStorage");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching posts data", error);
  //     }
  //   };

  //   const getGardeningPosts = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const response = await axios.get(`${apiUrl}/posts`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         if (response.status === 200 && response.data && response.data.posts) {
  //           const filteredPosts = response.data.posts.filter(
  //             (post: Post) => post.GardenedBy === userId
  //           );
  //           const sortedPosts = filteredPosts.sort(
  //             (a: any, b: any) =>
  //               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //           );
  //           setGardeningPosts(sortedPosts);
  //         } else {
  //           console.error(
  //             "Failed to fetch posts data, status code:",
  //             response.status
  //           );
  //         }
  //       } else {
  //         console.error("No token found in AsyncStorage");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching posts data", error);
  //     }
  //   };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  //   const deletePost = async (postId: string) => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const response = await axios.delete(`${apiUrl}/posts/delete`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           data: { id: postId },
  //         });
  //         if (response.status === 200) {
  //           setPosts((prevPosts) =>
  //             prevPosts.filter((post) => post.id !== postId)
  //           );
  //         } else {
  //           console.error("Failed to delete post, status code:", response.status);
  //         }
  //       } else {
  //         console.error("No token found in AsyncStorage");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting post", error);
  //     }
  //   };

  //   const deleteAccount = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const response = await axios.delete(`${apiUrl}/users/delete`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           data: { id: userId },
  //         });
  //         if (response.status === 200) {
  //           await AsyncStorage.removeItem("token");
  //           navigation.navigate("Login");
  //         } else {
  //           console.error(
  //             "Failed to delete account, status code:",
  //             response.status
  //           );
  //         }
  //       } else {
  //         console.error("No token found in AsyncStorage");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting account", error);
  //     }
  //   };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postGroupContainer}>
        <View style={styles.postContainerLeft}>
          {item.image && (
            <Image
              source={{ uri: `data:image/png;base64,${item.image}` }}
              style={styles.imageItem}
            />
          )}
        </View>
        <View style={styles.postContainerRight}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postedBy}>Posté par: {item.postedBy}</Text>
          <Text style={styles.createdAt}>Le {formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <TouchableOpacity
        // onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  //   const onRefresh = async () => {
  //     setRefreshing(true);
  //     await getUserPosts();
  //     if (userRole === 2) {
  //       await getGardeningPosts();
  //     }
  //     setRefreshing(false);
  //   };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  //   const handleDelete = (postId: string) => {
  //     Alert.alert(
  //       "Confirmation de suppression",
  //       "Êtes-vous sûr de vouloir supprimer ce post ?",
  //       [
  //         {
  //           text: "Annuler",
  //           onPress: () => console.log("Suppression annulée."),
  //           style: "cancel",
  //         },
  //         { text: "OK", onPress: () => deletePost(postId) },
  //       ]
  //     );
  //   };

  //   const handleAccountDelete = () => {
  //     Alert.alert(
  //       "Confirmation de suppression",
  //       "Êtes-vous sûr de vouloir supprimer votre compte ?",
  //       [
  //         {
  //           text: "Annuler",
  //           onPress: () => console.log("Suppression de compte annulée."),
  //           style: "cancel",
  //         },
  //         { text: "OK", onPress: deleteAccount },
  //       ]
  //     );
  //   };

  const filteredPosts = selectedTab === "all" ? posts : gardeningPosts;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.iconBackground}>
          <FontAwesome name="user" size={60} color="white" />
        </View>
        <Text style={styles.userName}>{username}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Deconnexion</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteAccountButton}
        // onPress={handleAccountDelete}
      >
        <Text style={styles.deleteAccountText}>Supprimer le compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  iconBackground: {
    backgroundColor: "#114187",
    borderRadius: 50,
    padding: 20,
    width: 100,
    height: 100,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 100,
    height: 100,
    borderColor: "#000",
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  logoutButton: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#114187",
    borderRadius: 4,
    width: 200,
    alignSelf: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  deleteAccountButton: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 4,
    width: 200,
    alignSelf: "center",
  },
  deleteAccountText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  deleteButton: {
    backgroundColor: "#F2EAE3",
    padding: 10,
    width: 150,
    borderRadius: 4,
    margin: 4,
    alignSelf: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#000",
    fontFamily: "Montserrat_600SemiBold",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeTabButton: {
    backgroundColor: "#347355",
  },
  tabButtonText: {
    fontFamily: "Montserrat_400Regular",
    color: "#000",
    fontSize: 16,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    alignSelf: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  postList: {
    width: "100%",
  },
  postContainer: {
    margin: 16,
    borderRadius: 4,
    backgroundColor: "#347355",
    maxHeight: 300,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  postGroupContainer: {
    flexDirection: "row",
  },
  postContainerLeft: {
    marginRight: 10,
    backgroundColor: "#F2EAE3",
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  postContainerRight: {
    flex: 1,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  postContent: {
    fontSize: 16,
    marginTop: 10,
    width: "100%",
    color: "#FFF",
    marginLeft: 10,
    padding: 8,
    marginBottom: 10,
  },
  postedBy: {
    fontSize: 14,
    marginTop: 5,
    color: "#FFF",
  },
  createdAt: {
    fontSize: 14,
    marginTop: 5,
    color: "#FFF",
  },
});

export default UserProfile;
