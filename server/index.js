const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
//const { address } = require("../client/src/Wallet");

app.use(cors());
app.use(express.json());

const balances = {
  "393fc9eb56ba240cca447500230889cddd3dea41": 100,
  "436fadc50945cda71b400e481f137eaef67583ce": 50,
  "9cf2e8a466ca30d421380cc8c5cecddefd6c4a1d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client-side app
  //      recover the public address from the signature
  //      This would be the sender.
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
