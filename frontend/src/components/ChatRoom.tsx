import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Chats from "./Chats";
import { Chat } from "./ChatBubble";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import EncryptionMethods, { EncryptionMethod } from "./EncryptionMethods";

function toCaesar(message: string) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const conversions = new Map();
  letters.split("").forEach((letter, idx) => {
    conversions.set(letter, letters[(idx + 23) % letters.length]);
  });
  return message
    .split("")
    .map((letter) =>
      letters.includes(letter.toLowerCase())
        ? letter === letter.toUpperCase()
          ? conversions.get(letter.toLowerCase()).toUpperCase()
          : conversions.get(letter)
        : letter
    )
    .join("");
}

interface ChatRoomProps {
  socket: Socket;
  roomId: string;
  keys: { pub: string; priv: string };
}

const ChatRoom: React.FC<ChatRoomProps> = ({ socket, roomId, keys }) => {
  const [message, setMessage] = useState("");
  const [encryptionMethod, setEncryptionMethod] =
    useState<EncryptionMethod>("None");

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    socket.on("receive message", (data: { chats: Chat[] }) => {
      setChats(data.chats);
    });

    return () => {
      socket.off("receive message");
    };
  }, []);
  function handleMessageSend() {
    if (encryptionMethod === "None") {
      socket.emit("send message", { encryptionMethod, message, roomId });
    } else if (encryptionMethod === "Caesars Cipher") {
      socket.emit("send message", {
        encryptionMethod,
        message: toCaesar(message),
        roomId,
      });
    } else if (encryptionMethod === "Public/Private") {
      socket.emit("send message", {
        encryptionMethod,
        message,
        roomId,
      });
    }
    setMessage("");
  }
  return (
    <Box>
      <Typography variant="h3" margin={1} align="center">
        Encryption Playground! Chat in room {roomId}
      </Typography>
      <Box width="100%" height="100%" display="flex" maxHeight="90vh">
        <Box flex={2} pl={1} maxHeight="90vh" overflow="auto">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Select an Encryption Method
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="None"
              name="radio-buttons-group"
              value={encryptionMethod}
              onChange={(e) =>
                setEncryptionMethod(e.target.value as EncryptionMethod)
              }
            >
              <FormControlLabel value="None" control={<Radio />} label="None" />
              <FormControlLabel
                value="Caesars Cipher"
                control={<Radio />}
                label="Caesar's Cipher"
              />
              <FormControlLabel
                value="Public/Private"
                control={<Radio />}
                label="Public/Private Key"
              />
            </RadioGroup>
          </FormControl>
          <EncryptionMethods method={encryptionMethod} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          height="90vh"
          flex={3}
          borderLeft="1px solid black"
          px={2}
          pt={2}
        >
          <Chats chats={chats} keys={keys} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMessageSend;
            }}
          >
            <Box display="flex">
              <TextField
                variant="filled"
                fullWidth
                label="type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></TextField>
              <Button
                variant="contained"
                onClick={handleMessageSend}
                type="submit"
              >
                Send
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatRoom;
