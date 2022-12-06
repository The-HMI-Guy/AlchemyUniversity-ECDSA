import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
}) {
  async function onChange(evt) {
    const signature = evt.target.value;
    setSignature(signature);

    // TODO: change the hard-coded msg to the amount sent via client
    const publicKey = await recoverKey("10", signature, 1);
    const address = toHex(getAddress(publicKey));
    setAddress(address);

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

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input
          placeholder="Enter signature"
          value={signature}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
