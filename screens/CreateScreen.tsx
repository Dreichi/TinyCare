// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Platform,
//   Switch,
//   Alert,
//   SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import apiUrl from "../api";

// export default function CreateScreen({ navigation }: { navigation: any }) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingAddress, setLoadingAddress] = useState(false);
//   const [isGardening, setIsGardening] = useState(false);
//   const [location, setLocation] = useState<Location.LocationObject | null>(
//     null
//   );
//   const [address, setAddress] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== "web") {
//         const { status: mediaLibraryStatus } =
//           await ImagePicker.requestMediaLibraryPermissionsAsync();
//         const { status: cameraStatus } =
//           await ImagePicker.requestCameraPermissionsAsync();
//         const { status: locationStatus } =
//           await Location.requestForegroundPermissionsAsync();
//         if (
//           mediaLibraryStatus !== "granted" ||
//           cameraStatus !== "granted" ||
//           locationStatus !== "granted"
//         ) {
//           alert(
//             "Sorry, we need camera, media library and location permissions to make this work!"
//           );
//         }
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const takePhoto = async () => {
//     let result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const getLocation = async () => {
//     setLoadingAddress(true);
//     try {
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//       const response = await Location.reverseGeocodeAsync(location.coords);
//       if (response.length > 0) {
//         const { street, city, region, postalCode, country } = response[0];
//         setAddress(`${street}, ${city}, ${region}, ${postalCode}, ${country}`);
//       } else {
//         setAddress(null);
//         Alert.alert("Error", "Unable to retrieve address.");
//       }
//     } catch (error) {
//       console.error("Error getting location", error);
//       Alert.alert("Error", "Unable to retrieve location.");
//     } finally {
//       setLoadingAddress(false);
//     }
//   };

//   const createPost = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("content", content);
//         formData.append("isGardening", JSON.stringify(isGardening));
//         if (location) {
//           formData.append("latitude", location.coords.latitude.toString());
//           formData.append("longitude", location.coords.longitude.toString());
//         }
//         if (imageUri) {
//           formData.append("image", {
//             uri: imageUri,
//             type: "image/jpeg",
//             name: "photo.jpg",
//           } as any);
//         }

//         const response = await axios.post(`${apiUrl}/posts/create`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         if (response.status === 201) {
//           setAddress(null);
//           setContent("");
//           setImageUri(null);
//           setIsGardening(false);
//           setTitle("");
//           setLocation(null);

//           navigation.navigate("Home");
//         } else {
//           console.error("Failed to create post, status code:", response.status);
//         }
//       } else {
//         console.error("No token found in AsyncStorage");
//       }
//     } catch (error) {
//       console.error("Error creating post", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <Text style={styles.mainTitle}>Créer une publication</Text>
//         <TextInput
//           placeholder="Titre"
//           placeholderTextColor={"white"}
//           style={styles.input}
//           value={title}
//           onChangeText={setTitle}
//         />
//         <TextInput
//           placeholder="Description"
//           placeholderTextColor={"white"}
//           style={styles.input}
//           value={content}
//           onChangeText={setContent}
//           // multiline
//         />
//         <View style={styles.switchContainer}>
//           <Text style={styles.label}>
//             Je souhaite que quelqu'un vienne s'occuper de ma plante
//           </Text>
//           <Switch value={isGardening} onValueChange={setIsGardening} />
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={pickImage}>
//             <Text style={styles.buttonText}>Choisir une image</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={takePhoto}>
//             <Text style={styles.buttonText}>Prendre une photo</Text>
//           </TouchableOpacity>
//         </View>
//         {imageUri && (
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         )}
//         <TouchableOpacity style={styles.button} onPress={getLocation}>
//           <Text style={styles.buttonText}>
//             {loadingAddress
//               ? "Localisation en cours..."
//               : "Récupérer ma localisation"}
//           </Text>
//         </TouchableOpacity>
//         {address && <Text style={styles.address}>Addresse: {address}</Text>}
//         <TouchableOpacity style={styles.button} onPress={createPost}>
//           <Text style={styles.buttonText}>
//             {loading ? "Publication en cours..." : "CRÉER"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: Platform.OS === "android" ? 60 : 24,
//     flex: 1,
//     padding: 20,
//     alignItems: "center",
//   },
//   mainTitle: {
//     fontFamily: "Montserrat_700Bold",
//     fontSize: 24,
//     marginBottom: 16,
//     color: "#347355",
//   },
//   input: {
//     height: 50,
//     borderColor: "transparent",
//     fontSize: 12,
//     borderRadius: 6,
//     backgroundColor: "rgba(13, 13, 13, 0.8)",
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     color: "white",
//     padding: 4,
//     fontFamily: "Montserrat_600SemiBold",
//     maxWidth: 300,
//     alignSelf: "center",
//     alignContent: "center",
//     alignItems: "center",
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   switchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//     gap: 10,
//     width: 250,
//     justifyContent: "center",
//   },
//   label: {
//     // marginRight: 10,
//     fontFamily: "Montserrat_400Regular",
//     color: "#272727",
//   },
//   buttonContainer: {
//     flexDirection: "column",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   button: {
//     height: 50,
//     fontSize: 12,
//     borderColor: "transparent",
//     borderRadius: 6,
//     backgroundColor: "#347355",
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     color: "#fff",
//     padding: 4,
//     fontFamily: "Montserrat_600SemiBold",
//     maxWidth: 300,
//     alignSelf: "center",
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 18,
//     textAlign: "center",
//     fontFamily: "Montserrat_600SemiBold",
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//     marginVertical: 10,
//   },
//   address: {
//     fontSize: 16,
//     marginVertical: 10,
//     textAlign: "center",
//     fontFamily: "Montserrat_400Regular",
//     color: "#272727",
//   },
// });
