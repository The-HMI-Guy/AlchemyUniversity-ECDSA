const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY =
  "aa4dcdbb0fc7785095ed8d0db6a455ff0ddd406241ca88026d5f50fc812c1a4a";

signedTransaction();

async function signedTransaction() {
  const [sig, recoveryBit] = await signMessage("10");
  const publicKey = await recoverKey("10", sig, recoveryBit);
  const address = toHex(getAddress(publicKey));

  console.log("Signature " + toHex(sig));
  console.log("Public Key " + toHex(publicKey));
  console.log("Address: " + address);
}

async function signMessage(msg) {
  const messageHash = hashMessage(msg);
  return secp.sign(messageHash, PRIVATE_KEY, { recovered: true });
}
function hashMessage(message) {
  return (message = keccak256(utf8ToBytes(message)));
}
async function recoverKey(message, signature, recoveryBit) {
  const messageHash = hashMessage(message);
  return secp.recoverPublicKey(messageHash, signature, recoveryBit);
}
function getAddress(publicKey) {
  // the first byte indicates whether this is in compressed form or not
  return keccak256(publicKey.slice(1)).slice(-20);
}
// Signature: 3045022100f572ae02ae7c26c8c339068a3a70bcb66eac6b4cef434a2ce5c65b375428624e02201a3a86b8376f4dae45658b62e2781945f20248a246b71f3e527d5eb76329019f
// Private Key: 0e9c7034df2b7b3717698a58728b59dbe0dfae0afe816bd501217893906952bb
// Public Key: 04affd651791b5218e43f71466866c86d46f178f270c3df3c98b4972d202a4e52a999f5919704973f16a65754d13b453d0dbe53469247dd86713017c96fad8585e
// Address: 3cf848671030b43424dbda6a26455957e3e41a0d
