import { Buffer } from "buffer";
export const key = "PSX-VNO-TNS-GD3";
export const decodeBase64 = (input: string) => {
  const buffer = Buffer.from(input, "base64");
  return new Uint8Array(buffer);
};
export const decrypt = (encryptedText: string, key: string) => {
  const encryptedBytes = decodeBase64(encryptedText);
  const keyBytes = Buffer.from(key);

  for (let i = 0; i < encryptedBytes.length; i++) {
    encryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return Buffer.from(encryptedBytes).toString("utf-8");
};

export const encrypt = (plainText: string, key: string) => {
  // Convert JSON object to a string
  const jsonString = JSON.stringify(plainText);
  let encrypted = "";
  for (let i = 0; i < jsonString.length; i++) {
    encrypted += String.fromCharCode(jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }

  // Encode the encrypted string to base64 using buffer
  return Buffer.from(encrypted, "binary").toString("base64");
};
