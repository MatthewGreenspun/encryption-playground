import { createServer } from "http";
import * as crypto from "crypto";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

type EncryptionMethod = "None" | "Caesars Cipher" | "Public/Private";

function genUid() {
  return Math.floor(Math.random() * 1000000).toString();
}

function encrypt(message: string, publicKey: crypto.KeyObject) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message)
  );
  return encryptedData.toString("base64");
}

class Chat {
  encryptedText: string;
  encryptionMethod: EncryptionMethod;
  decryptedMessage?: string;
  sender: string;
  constructor(
    encryptedText: string,
    encryptionMethod: EncryptionMethod,
    sender: string,
    decryptedMessage: string
  ) {
    this.encryptedText = encryptedText;
    this.encryptionMethod = encryptionMethod;
    this.sender = sender;
    this.decryptedMessage = decryptedMessage;
  }
}

class Person {
  id: string;
  name: string;
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
  chats: Chat[];
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.chats = [];
  }

  getKeys() {
    return {
      pub: this.publicKey.export({ format: "pem", type: "pkcs1" }),
      priv: this.privateKey.export({ format: "pem", type: "pkcs1" }),
    };
  }
}

class Room {
  id: string;
  people: Person[];
  names: Record<string, string>;
  constructor(_id: string) {
    this.id = _id;
    this.people = [];
    this.names = {};
  }
  chatToAll(
    encryptedText: string,
    encryptionMethod: EncryptionMethod,
    senderId: string
  ) {
    for (let i = 0; i < this.people.length; i++) {
      this.people[i].chats.push(
        new Chat(
          encryptedText,
          encryptionMethod,
          senderId === this.people[i].id ? "me" : this.names[senderId],
          ""
        )
      );
      io.to(this.people[i].id).emit("receive message", {
        chats: this.people[i].chats,
      });
    }
  }
}

const rooms: Record<string, Room> = {};

io.on("connection", (socket: Socket) => {
  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("create room", (data: { name: string }) => {
    const roomId = genUid();
    const room = new Room(roomId);
    const person = new Person(socket.id, data.name);
    const keys = person.getKeys();
    room.people.push(person);
    room.names[socket.id] = data.name;
    rooms[roomId] = room;
    socket.emit("joined room", { roomId, keys });
  });

  socket.on("join room", (data: { roomId: string; name: string }) => {
    if (data.roomId in rooms) {
      const person = new Person(socket.id, data.name);
      const keys = person.getKeys();
      rooms[data.roomId].people.push(person);
      rooms[data.roomId].names[socket.id] = data.name;
      socket.join(data.roomId);
      socket.emit("joined room", { roomId: data.roomId, keys });
    } else {
      socket.emit("joined room error", "invalid room code");
    }
  });

  socket.on(
    "send message",
    (data: {
      roomId: string;
      encryptionMethod: EncryptionMethod;
      message: string;
    }) => {
      if (
        data.encryptionMethod === "None" ||
        data.encryptionMethod === "Caesars Cipher"
      ) {
        rooms[data.roomId].chatToAll(
          data.message,
          data.encryptionMethod,
          socket.id
        );
      } else if (data.encryptionMethod === "Public/Private") {
        const room = rooms[data.roomId];
        for (let i = 0; i < room.people.length; i++) {
          const publicKey = room.people[i].publicKey;
          room.people[i].chats.push(
            new Chat(
              encrypt(data.message, publicKey),
              data.encryptionMethod,
              socket.id === room.people[i].id ? "me" : room.names[socket.id],
              data.message
            )
          );
          io.to(room.people[i].id).emit("receive message", {
            chats: room.people[i].chats,
          });
        }
      }
    }
  );
});

httpServer.listen(3000);
