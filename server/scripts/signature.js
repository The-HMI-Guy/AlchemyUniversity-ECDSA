const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY =
  "0e9c7034df2b7b3717698a58728b59dbe0dfae0afe816bd501217893906952bb";

signedTransaction();

async function signedTransaction() {
  const sig = await signMessage("10");
  const recoveryBit = true;
  const recov = await recoverKey("10", sig, recoveryBit);

//   console.log("Recovered: " + recov);
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

// Private Key: 0e9c7034df2b7b3717698a58728b59dbe0dfae0afe816bd501217893906952bb
// Public Key: 04affd651791b5218e43f71466866c86d46f178f270c3df3c98b4972d202a4e52a999f5919704973f16a65754d13b453d0dbe53469247dd86713017c96fad8585e
// Address: 3cf848671030b43424dbda6a26455957e3e41a0d
