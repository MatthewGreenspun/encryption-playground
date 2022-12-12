import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import notSecure from "../assets/not-secure.jpeg";
import caesarsCipher from "../assets/caesars-cipher.jpeg";
import publicKey from "../assets/public-key.jpeg";

const Image = styled.img<{ width: string }>`
  width: ${(props) => props.width};
  display: block;
  margin: 0 auto;
`;

const Paragraph = styled(Typography)`
  font-size: 1.2rem;
  color: black;
  margin: 4px;
`;

const Heading = styled(Typography)`
  font-size: 2rem;
  color: black;
  font-weight: 800;
  margin: 16px 4px;
`;

export type EncryptionMethod = "None" | "Caesars Cipher" | "Public/Private";

interface EncryptionMethodsProps {
  method: EncryptionMethod;
}

const EncryptionMethods: React.FC<EncryptionMethodsProps> = ({ method }) => {
  if (method === "None")
    return (
      <Box>
        <Heading variant="h5">No Encryption</Heading>
        <Paragraph variant="body1">
          No encryption means that data is being sent across the internet in
          plain-text form. Anybody who is listening to your network can view the
          contents of your communication. This is considered highly insecure,
          and most web browsers will even display a message letting you know the
          dangers of such websites.
        </Paragraph>
        <Image src={notSecure} alt="not secure message" width="300px" />
        <Paragraph variant="body1">
          Although it is generally safe to view information from such websites,
          you should never share any information on them, especially passwords,
          credit card numbers, or other personal details.
        </Paragraph>
        <Paragraph variant="body1">
          As you can see by the demo, a hacker can see all of your
          communications in plain-text if you don't use encryption.
        </Paragraph>
      </Box>
    );
  else if (method === "Caesars Cipher")
    return (
      <Box>
        <Heading variant="h5">Caesar's Cipher</Heading>
        <Paragraph variant="body1">
          The Caesar Cipher is one the earliest known encryption methods. It is
          believed to have been used over 2000 years ago by Julius Caesar to
          hide important military messages!
        </Paragraph>
        <Image src={caesarsCipher} alt="Caesar Cipher Diagram" width="80%" />
        <Paragraph variant="body1">
          It works by shifting each letter in the message by a set amount. In
          the example above, each letter is shifted 3 spaces backwards, such
          that an "A" becomes an "X", a "B", becomes a "Y", a "C" becomes a "Z",
          a "D" becomes an "A", etc.
        </Paragraph>
        <Paragraph variant="body1">
          Although it is too simplistic to be secure in modern times, it is
          still useful for understanding the basic concepts behind encryption.
          Try it out in the demo!
        </Paragraph>
      </Box>
    );
  else if (method === "Public/Private")
    return (
      <Box>
        <Heading variant="h5">Public/Private Key Encryption</Heading>
        <Paragraph variant="body1">
          Public/Private key encryption is the most secure and widely used
          method of encryption. It works by generating 2 keys for each person in
          the chat room:
        </Paragraph>
        <Paragraph>
          1) A public key which can be shared with everyone in the chat room
          (and with potential hackers){" "}
        </Paragraph>
        <Paragraph>
          2) A private key which should only be accessible to the person who
          generated it.{" "}
        </Paragraph>
        <Paragraph variant="body1">
          When a person sends a message, they encrypt it using the other
          participant's public keys. This essentially "locks" the message and
          prevents it from being read by hackers. The only way to "unlock" the
          message is to use the private key which corresponds to the public key
          that the message was encrypted with.
        </Paragraph>
        <Paragraph variant="body1">
          This method of encryption is used by all secure websites. A url which
          begins with "https" is secure, because all traffic is encrypted using
          the website's public key, and can only be unlocked by the website
          using its private key.
        </Paragraph>
        <Image src={publicKey} alt="Google.com Public Key" width="80%" />
        <Paragraph>
          The above image shows the public key which google.com uses to encrypt
          your searches.
        </Paragraph>
      </Box>
    );
  return <Box></Box>;
};

export default EncryptionMethods;
