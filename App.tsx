import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Navbar from "./components/Navbar";
import { View, ActivityIndicator, SafeAreaView } from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { EmailProvider } from "./context/EmailContext";
import ChatScreen from "./screens/ChatScreen";
import TermsScreen from "./screens/TermsScreen";
import { supabase } from "./utils/supabase";
import { LogBox } from "react-native";
import BabyInfo from "./screens/BabyInfo";
import Appointment from "./screens/Appointment";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Post: undefined;
  BabyInfo: { baby_id: number };
  Appointment: { baby_id: number };
  ChatScreen: { conversationId: number; otherUserName: string };
  Terms: undefined;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <EmailProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "Home" : "Login"}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Navbar}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BabyInfo"
              component={BabyInfo}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Appointment"
              component={Appointment}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={({ route }) => ({
                title: route.params?.otherUserName || "Chat",
              })}
            />
            <Stack.Screen name="Terms" component={TermsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </EmailProvider>
  );
}
