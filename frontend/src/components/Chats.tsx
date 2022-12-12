import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import ChatBubble, { Chat } from "./ChatBubble";

interface ChatsProps {
  chats: Chat[];
  keys: { pub: string; priv: string };
}

const Chats: React.FC<ChatsProps> = ({ chats, keys }) => {
  return (
    <Box
      flex={2}
      height="100%"
      display="flex"
      flexDirection="column"
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      {chats.map((chat, idx) => (
        <ChatBubble chat={chat} key={idx} keys={keys} />
      ))}
    </Box>
  );
};

export default Chats;
