import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const LineThroughText = styled(Typography)`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #000;
  line-height: 0.1em;
  margin: 10px 0 20px;
  > span {
    background-color: white;
    padding: 10px;
  }
`;

interface CreateRoomProps {
  socket: Socket;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ socket }) => {
  const [roomId, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [joinError, setJoinError] = useState("");
  useEffect(() => {
    socket.on("joined room error", (errorCode) => {
      setJoinError(errorCode);
      return () => {
        socket.off("joined room error");
      };
    });
  }, []);
  function handleCreateRoom() {
    socket.emit("create room", { name });
  }

  function handleJoinRoom() {
    socket.emit("join room", { roomId, name });
  }

  return (
    <Box
      mt={20}
      padding={4}
      maxWidth={800}
      borderRadius={4}
      boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h4">Welcome to Encryption Playground!</Typography>
      <Typography variant="h6" align="center">
        Chat and learn about encryption!
      </Typography>
      <TextField
        margin="normal"
        label="enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleCreateRoom}>
        Create a Chat Room
      </Button>
      <hr></hr>
      <LineThroughText variant="h6">
        {" "}
        <span>OR</span>{" "}
      </LineThroughText>
      <TextField
        margin="normal"
        label="enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="enter a room code"
        value={roomId}
        onChange={(e) => setRoomCode(e.target.value)}
        error={!!joinError}
        helperText={joinError}
      />
      <Box height={10} />
      <Button variant="contained" color="primary" onClick={handleJoinRoom}>
        Join a Chat Room
      </Button>
    </Box>
  );
};

export default CreateRoom;
