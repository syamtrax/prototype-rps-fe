import React, { useEffect, useState } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import io from "socket.io-client";
const socket = io("http://localhost:3000");
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import GamePlay from "./pages/Gameplay";
import Login from "./pages/Login";
import Gameplay2 from "./pages/Gameplay copy";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GamePlay2"
          component={GamePlay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GamePlay"
          component={Gameplay2}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
