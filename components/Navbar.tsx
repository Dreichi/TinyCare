import React from "react";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import CreateScreen from "../screens/CreateScreen";
// import MessageScreen from "../screens/MessageScreen";

const Tab = createBottomTabNavigator();

type TabParamList = {
  Home: undefined;
  Create: undefined;
  Notifications: undefined;
  Profile: undefined;
  MessageScreen: { recipientId: number };
};

const screenOptions = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) => {
  return {
    tabBarIcon: ({ color, size }: { color: string; size: number }) => {
      let iconName: React.ComponentProps<typeof FontAwesome>["name"];

      switch (route.name) {
        case "Home":
          iconName = "home";
          break;
        case "Create":
          iconName = "plus";
          break;
        case "Message":
          iconName = "comments";
          break;
        case "Profile":
          iconName = "user";
          break;
        default:
          iconName = "circle";
      }

      return <FontAwesome name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "#347355",
    tabBarInactiveTintColor: "gray",
  };
};

const Navbar: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      /> */}
    </Tab.Navigator>
  );
};

export default Navbar;
