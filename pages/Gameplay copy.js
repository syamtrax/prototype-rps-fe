import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import socket from "../components/socket";
import { useRoute } from "@react-navigation/native";

const Gameplay2 = () => {
  const route = useRoute();
  const { data } = route.params;
  const [connected, setConnected] = useState(false);
  const [move, setMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [timer, setTimer] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [scores, setScores] = useState({});
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    if (data) {
      setConnected(true);
    }

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("start-game", (message) => {
      console.log(message);
      setMove(null);
      setOpponentMove(null);
      setRoundResult(null);
      setGameResult(null);
      setRounds(0);
      setScores({});
    });

    socket.on(
      "round-result",
      ({ roundResult, winnerSocketId, scores, rounds }) => {
        setRoundResult(roundResult);
        setScores(scores);
        setTimer(0);
        setRounds(rounds);
        setMove(null);

        const isOpponentWinner = winnerSocketId && winnerSocketId !== socket.id;
        setOpponentMove(isOpponentWinner ? "Winner" : "Loser");
      }
    );

    socket.on("game-result", ({ gameResult, winnerSocketId, scores }) => {
      setGameResult(gameResult);
      setScores(scores);
      setTimer(0);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("start-round", ({ roundDuration }) => {
      setTimer(roundDuration);
      setMove(null);
      setRoundResult(null);
    });

    return () => {
      socket.off("start-round");
    };
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const makeMove = (move) => {
    if (data) {
      setMove(move);
      socket.emit("player-move", { roomId: data, move });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rock Paper Scissors</Text>

      {!connected && <Text style={styles.error}>Not connected to server</Text>}

      <View style={styles.movesContainer}>
        <Button
          title="Rock"
          onPress={() => makeMove("rock")}
          disabled={!!move}
        />
        <Button
          title="Paper"
          onPress={() => makeMove("paper")}
          disabled={!!move}
        />
        <Button
          title="Scissors"
          onPress={() => makeMove("scissors")}
          disabled={!!move}
        />
      </View>

      {move && <Text>Your Move: {move}</Text>}
      {opponentMove && <Text>Opponent's Status: {opponentMove}</Text>}

      {timer > 0 && <Text style={styles.timer}>Timer: {timer}s</Text>}

      {roundResult && (
        <Text style={styles.result}>
          Round {rounds} Result:{" "}
          {roundResult === "draw"
            ? "It's a Draw!"
            : `Winner: ${roundResult === socket.id ? "You" : "Opponent"}`}
        </Text>
      )}

      {scores && (
        <Text style={styles.scores}>
          Scores - You: {scores[socket.id] || 0}, Opponent:{" "}
          {Object.keys(scores)
            .filter((id) => id !== socket.id)
            .map((id) => scores[id] || 0)}
        </Text>
      )}

      {gameResult && (
        <Text style={styles.finalResult}>
          Final Result:{" "}
          {gameResult === "draw"
            ? "It's a Draw!"
            : gameResult === socket.id
            ? "You Win the Game!"
            : "Opponent Wins the Game!"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  movesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  timer: {
    fontSize: 18,
    color: "red",
    marginVertical: 10,
  },
  result: {
    fontSize: 18,
    color: "blue",
    marginVertical: 10,
  },
  scores: {
    fontSize: 16,
    marginVertical: 10,
  },
  finalResult: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginVertical: 20,
  },
  error: {
    fontSize: 16,
    color: "red",
    marginVertical: 10,
  },
});

export default Gameplay2;
