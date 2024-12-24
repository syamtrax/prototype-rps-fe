import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import socket from "../components/socket";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Rock from "../assets/rock.png";
import Paper from "../assets/paper.png";
import Scissor from "../assets/scissor.png";
import Background from "../assets/background.png";
import LeftPaper from "../assets/HUMANpaper.png";
import LeftRock from "../assets/HUMANrock.png";
import LeftScissor from "../assets/HUMANscissors.png";
import RightPaper from "../assets/AIpaper.png";
import RightRock from "../assets/AIrock.png";
import RightScissor from "../assets/AIscissors.png";

const { height: screenHeight } = Dimensions.get("window");
const { width: screenWidth } = Dimensions.get("window");

const GamePlay = () => {
  const route = useRoute();
  const { data } = route.params; // Room ID passed from Home screen
  const [message, setMessage] = useState("");
  const [opponentMove, setOpponentMove] = useState(null);
  const [playerMove, setPlayerMove] = useState(null);
  const [timer, setTimer] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const playerMoveRef = useRef(null);
  const animationValue = useRef(new Animated.Value(0)).current;

  const leftHandPosition = useRef(new Animated.Value(-200)).current; // Start off-screen on the left
  const rightHandPosition = useRef(
    new Animated.Value(screenWidth + 200)
  ).current; // Start off-screen on the right

  useEffect(() => {
    const handWidth = 200; // The width of your hand images
    const centerPosition = (screenWidth - handWidth) / 2;

    if (timer == 1) {
      // Start the animation
      Animated.timing(leftHandPosition, {
        toValue: centerPosition - handWidth / 1.5, // Adjust to center from the left
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(rightHandPosition, {
        toValue: centerPosition + handWidth / 1.5, // Adjust to center from the right
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [timer]);

  const images = {
    rock: Rock,
    paper: Paper,
    scissors: Scissor,
  };

  const playerHand = {
    rock: LeftRock,
    paper: LeftPaper,
    scissors: LeftScissor,
  };
  const opponentHand = {
    rock: RightRock,
    paper: RightPaper,
    scissors: RightScissor,
  };

  useEffect(() => {
    socket.on("start-game", (msg) => {
      setMessage(msg);
      console.log(msg);
    });

    socket.on("opponent-move", (move) => {
      setOpponentMove(move);
    });
    

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    playerMoveRef.current = playerMove;
  }, [playerMove]);

  useEffect(() => {
    if (opponentMove && !playerMoveRef.current) {
      startCountdown();
    }
  }, [opponentMove]);

  const startCountdown = () => {
    setTimer(5);
    const countdownInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          handleTimeout();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (!playerMoveRef.current) {
      Alert.alert(
        "Time's up!",
        "You didn't choose a move. You lose this round."
      );
      socket.emit("player-move", { roomId: data, move: "none" });
    }
  };

  const sendMove = (move) => {
    setPlayerMove(move);
    socket.emit("player-move", { roomId: data, move });
    triggerAnimation();
  };

  const triggerAnimation = () => {
    animationValue.setValue(0);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (playerMove && opponentMove) {
      const result = determineWinner(playerMove, opponentMove);
      setRoundResult(result);
      // Alert.alert("Round Result", result);
    }
  }, [playerMove, opponentMove]);

  const determineWinner = (player, opponent) => {
    if (player === "none") return "You lost! You didn't choose.";
    if (opponent === "none") return "You won! Opponent didn't choose.";
    if (player === opponent) return "It's a draw!";
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "scissors" && opponent === "paper") ||
      (player === "paper" && opponent === "rock")
    ) {
      return "You win!";
    } else {
      return "You lose!";
    }
  };

  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <ImageBackground style={styles.background} source={Background}>
        <View style={styles.container}>
          {roundResult && (
            <>
              <View style={styles.handContainer}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "yellow",
                  }}
                >
                  {roundResult}
                </Text>
              </View>
              <View style={styles.handContainer}>
                <Animated.Image
                  source={playerHand[playerMove]}
                  style={[
                    styles.hand,
                    { transform: [{ translateX: leftHandPosition }] },
                  ]}
                />
                <Animated.Image
                  source={opponentHand[opponentMove]}
                  style={[
                    styles.hand,
                    { transform: [{ translateX: rightHandPosition }] },
                  ]}
                />
              </View>
            </>
          )}
          <Text style={{ color: "white", fontSize: 24 }}>{message}</Text>
          <Text style={{ color: "white", fontSize: 18 }}>
            {timer > 0 ? timer : "Time's up!"}
          </Text>
          <Animated.Image
            source={images[playerMove]}
            style={[styles.animatedImage, { transform: [{ scale }], opacity }]}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => sendMove("rock")}
              style={[
                styles.button,
                styles.buttonLeft,
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <FontAwesome name="hand-rock-o" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendMove("paper")}
              style={[
                styles.button,
                styles.buttonCenter,
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <FontAwesome name="hand-paper-o" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendMove("scissors")}
              style={[
                styles.button,
                styles.buttonRight,
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <FontAwesome name="hand-scissors-o" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  handContainer: {
    flex: 1,
    justifyContent: "center",
    width: screenWidth,
    height: screenHeight,
  },
  hand: {
    position: "absolute",
    width: 200,
    height: 200,
    objectFit: "contain",
    zIndex: 1,
  },
  background: {
    flexDirection: "column",
    justifyContent: "flex-end",
    resizeMode: "cover",
    height: screenHeight,
    // flex: 1,
    width: screenWidth,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    position: "absolute",
    zIndex: 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: screenWidth,
    paddingHorizontal: 50,
    position: "absolute",
    bottom: 100,
  },
  button: {
    width: 90,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 60,
  },
  buttonLeft: {
    alignSelf: "flex-end",
  },
  buttonCenter: {
    alignSelf: "center",
    marginBottom: 40,
  },
  buttonRight: {
    alignSelf: "flex-end",
  },
});

export default GamePlay;
