import { useContext, useState } from "react";

const GameContext = useContext(null);

export const GameProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    
  }
};
