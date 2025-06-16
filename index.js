const express = require("express");
const bodyParser = require("body-parser");
const { sendWhatsAppMessage } = require("./whatsapp");
const { generateResponse } = require("./openai");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const mensagem = req.body.message;
  const telefone = req.body.phone;

  if (!mensagem || !telefone) return res.sendStatus(400);

  const resposta = await generateResponse(mensagem);

  await sendWhatsAppMessage(telefone, resposta);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});