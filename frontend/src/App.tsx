import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CreateRoom from "./components/CreateRoom";

import io from "socket.io-client";
import ChatRoom from "./components/ChatRoom";

const socket = io("http://localhost:3000");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("joined room", (data) => {
      setJoinedRoom(true);
      setRoomId(data.roomId);
      setKeys(data.keys);
      console.log(data.keys);
    });

    return () => {
      socket.off("connect");
      socket.off("joined room");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      maxHeight="100vh"
      maxWidth="100vw"
    >
      {joinedRoom && keys ? (
        <ChatRoom socket={socket} roomId={roomId} keys={keys} />
      ) : (
        <CreateRoom socket={socket} />
      )}
    </Box>
  );
}

export default App;
