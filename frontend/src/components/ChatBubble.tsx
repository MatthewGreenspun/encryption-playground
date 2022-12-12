import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import { EncryptionMethod } from "./EncryptionMethods";

export interface Chat {
  encryptedText: string;
  encryptionMethod: EncryptionMethod;
  decryptedMessage?: string;
  sender: string;
}

const SenderName = styled(Typography)`
  color: #333;
  font-size: 0.8rem;
  margin-left: 8px;
`;

const BubbleText = styled(Typography)`
  cursor: pointer;
  border-radius: 1.15rem;
  line-height: 1.25;
  max-width: min(800px, 50%);
  padding: 0.5rem 0.875rem;
  position: relative;
  word-wrap: break-word;
  word-break: break-all;
  margin: 4px;

  &:before,
  &:after {
    bottom: -0.1rem;
    content: "";
    height: 1rem;
    position: absolute;
  }

  &.from-me {
    align-self: flex-end;
    background-color: #248bf5;
    color: #fff;
  }

  &.from-them {
    align-self: flex-start;
    background-color: #ff7700;
    color: #fff;
  }

  &.from-me::before {
    border-bottom-left-radius: 0.8rem 0.7rem;
    border-right: 1rem solid #248bf5;
    right: -0.35rem;
    transform: translate(0, -0.1rem);
  }

  &.from-me::after {
    background-color: #fff;
    border-bottom-left-radius: 0.5rem;
    right: -40px;
    transform: translate(-30px, -2px);
    width: 10px;
  }

  &.from-them:before {
    border-bottom-right-radius: 0.8rem 0.7rem;
    border-left: 1rem solid #ff7700;
    left: -0.35rem;
    transform: translate(0, -0.1rem);
  }

  &.from-them::after {
    background-color: #fff;
    border-bottom-right-radius: 0.5rem;
    left: 20px;
    transform: translate(-30px, -2px);
    width: 10px;
  }
`;

interface ChatBubbleProps {
  keys: { pub: string; priv: string };
  chat: Chat;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ chat, keys }) => {
  const [text, setText] = useState(chat.encryptedText);
  const [showDecrypt, setShowDecrypt] = useState(false);

  const fromCaesar = useCallback((message: string) => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const conversions = new Map();
    letters.split("").forEach((letter, idx) => {
      conversions.set(letter, letters[(idx + 3) % letters.length]);
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
  }, []);

  const decrypt = useCallback(() => {
    if (chat.encryptionMethod === "None") {
      return chat.encryptedText;
    } else if (chat.encryptionMethod === "Caesars Cipher") {
      return fromCaesar(chat.encryptedText);
    } else if (chat.encryptionMethod === "Public/Private") {
      return chat.decryptedMessage as string;
    }
    return "";
  }, [chat]);

  return (
    <>
      {chat.sender !== "me" && <SenderName>{chat.sender}</SenderName>}
      <BubbleText
        onClick={() => {
          if (showDecrypt) {
            setText(chat.encryptedText);
            setShowDecrypt(false);
          } else {
            setText(decrypt());
            setShowDecrypt(true);
          }
        }}
        // onMouseEnter={() => setText(decrypt())}
        // onMouseLeave={() => setText(chat.encryptedText)}
        variant="h6"
        className={chat.sender === "me" ? "from-me" : "from-them"}
      >
        {text}
      </BubbleText>
    </>
  );
};

export default ChatBubble;
