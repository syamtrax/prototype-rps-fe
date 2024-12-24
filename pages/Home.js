import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import socket from "../components/socket";

import Background from "../assets/background.png";

// Initialize socket once globally

const { height: screenHeight } = Dimensions.get("window");
const { width: screenWidth } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [room, setRoom] = useState("");

  const handleJoinRoom = () => {
    if (room.trim()) {
      socket.emit("join-room", room);

      navigation.navigate("GamePlay", { data: room });
    } else {
      alert("Please enter a valid room name!");
    }
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View
        style={{
          marginHorizontal: 20,
          flex: 1,
          justifyContent: "center",
          gap: 20,
        }}
      >
        <TextInput
          onChangeText={setRoom}
          value={room}
          style={{
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 15,
            borderRadius: 20,
          }}
          placeholder="Enter Room Name"
          placeholderTextColor="gray"
        />
        <TouchableOpacity
          onPress={handleJoinRoom}
          style={{
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 15,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#2395D2",
            }}
          >
            Play Game
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flexDirection: "column",
    justifyContent: "flex-end",
    resizeMode: "cover",
    height: screenHeight,
    width: screenWidth,
  },
});

export default Home;
