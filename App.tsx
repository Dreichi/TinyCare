import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeManager from "./screens/HomeManager";
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
import ChildList from "./screens/ChildList";
import { FontAwesome } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Data from "./screens/Data";
import ManagerAppointment from "./screens/ManagerAppointment";
import NurseContact from "./screens/NurseContact";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  ChatScreen: { conversationId: number; otherUserName: string };
  Terms: undefined;
};

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
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
        name="Data"
        component={Data}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#114187",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function ManagerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "ManagerHome") {
            iconName = "briefcase";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#114187",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="ManagerHome"
        component={HomeManager}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
        const { data: userProfile } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setUserRole(userProfile?.role);
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
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                component={userRole === "manager" ? ManagerTabs : UserTabs}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="ChildList"
                component={ChildList}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={({ route }) => ({
                  title: route.params?.otherUserName || "Chat",
                })}
              />
              <Stack.Screen
                name="ManagerAppointment"
                component={ManagerAppointment}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Terms" component={TermsScreen} />
              <Stack.Screen
                name="NurseContact"
                component={NurseContact}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </EmailProvider>
  );
}
