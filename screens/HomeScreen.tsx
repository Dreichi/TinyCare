import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  RefreshControl,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // const getProfile = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("token");
    //     if (token) {
    //       const response = await axios.get(`${apiUrl}/users/profile`, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });
    //       if (response.status === 200 && response.data && response.data.data) {
    //         if (isMounted) {
    //           if (response.data.data.username) {
    //             setUsername(response.data.data.username);
    //           } else {
    //             console.error("Username not found in response.data.data");
    //           }
    //         }
    //       } else {
    //         console.error(
    //           "Failed to fetch profile data, status code:",
    //           response.status
    //         );
    //       }
    //     } else {
    //       console.error("No token found in AsyncStorage");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching profile data", error);
    //   }
    // };

    // const getPosts = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("token");
    //     if (token) {
    //       const response = await axios.get(`${apiUrl}/posts`, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });
    //       if (response.status === 200) {
    //         if (isMounted) {
    //           const sortedPosts = response.data.posts.sort(
    //             (a: any, b: any) =>
    //               new Date(b.createdAt).getTime() -
    //               new Date(a.createdAt).getTime()
    //           );
    //           setPosts(sortedPosts);
    //           setAllPosts(sortedPosts);
    //         }
    //       } else {
    //         console.error(
    //           "Failed to fetch posts data, status code:",
    //           response.status
    //         );
    //       }
    //     } else {
    //       console.error("No token found in AsyncStorage");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching posts data", error);
    //   }
    // };

    // getProfile();
    // getPosts();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const navigateToPost = (post: any) => {
    navigation.navigate("Post", { post });
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigateToPost(item)}>
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
            <Text style={styles.createdAt}>
              Le {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
        <Text style={styles.postContent}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  //   const onRefresh = async () => {
  //     setRefreshing(true);
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const response = await axios.get(`${apiUrl}/posts`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         if (response.status === 200) {
  //           const sortedPosts = response.data.posts.sort(
  //             (a: any, b: any) =>
  //               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //           );
  //           setPosts(sortedPosts);
  //           setAllPosts(sortedPosts);
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
  //     } finally {
  //       setRefreshing(false);
  //     }
  //   };

  const filteredPosts =
    selectedTab === "all"
      ? posts
      : posts.filter((post: any) => post.isGardening);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.greeting}>Bonjour {username}</Text>
      <TextInput
        placeholder="Rechercher"
        placeholderTextColor="white"
        style={styles.input}
        onChangeText={(text) => {
          if (text === "") {
            setPosts(allPosts);
          } else {
            setPosts(
              allPosts.filter(
                (post: {
                  title: string;
                  content: string;
                  postedBy: string;
                }) => {
                  return (
                    post.title.includes(text) ||
                    post.content.includes(text) ||
                    post.postedBy.includes(text)
                  );
                }
              )
            );
          }
        }}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "all" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === "all" && styles.activeTabButtonText,
            ]}
          >
            Tous les posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "gardening" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("gardening")}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === "gardening" && styles.activeTabButtonText,
            ]}
          >
            Gardiennage
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            // onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
    paddingTop: Platform.OS === "android" ? 32 : 0,
  },
  logo: {
    height: 100,
    width: 100,
    marginTop: Platform.OS === "android" ? 10 : 24,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    overflow: "scroll",
    padding: 5,
  },
  imageItem: {
    width: 100,
    height: 100,
    borderBottomRightRadius: 5,
  },
  input: {
    height: 50,
    fontSize: 12,
    borderColor: "transparent",
    borderRadius: 6,
    backgroundColor: "#347355",
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "#fff",
    padding: 4,
    fontFamily: "Montserrat_600SemiBold",
    maxWidth: 300,
    alignSelf: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submit: {
    backgroundColor: "rgba(52, 115, 85, 1)",
    padding: 4,
    borderRadius: 6,
    height: 50,
    justifyContent: "center",
    maxWidth: 300,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontFamily: "Montserrat_500Medium",
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    fontFamily: "Montserrat_500Medium",
  },
  button: {
    backgroundColor: "#347355",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
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
  postList: {
    marginTop: 20,
    width: "100%",
  },
  postContainer: {
    margin: 16,
    borderRadius: 24,
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
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  postTitle: {
    fontSize: 20,
    color: "#FFF",
    marginTop: 10,
    fontFamily: "Montserrat_700Bold",
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
    fontFamily: "Montserrat_400Regular",
  },
  createdAt: {
    fontSize: 14,
    marginTop: 5,
    color: "#FFF",
    fontFamily: "Montserrat_400Regular",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#272727",
    alignSelf: "center",
    fontFamily: "Montserrat_400Regular",
  },
});
