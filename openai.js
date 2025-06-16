const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateResponse(mensagemUsuario) {
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Você é um assistente para atendimento de planos de saúde. Ajude os clientes com dúvidas sobre planos, coberturas, valores, e agendamento com um corretor.",
      },
      {
        role: "user",
        content: mensagemUsuario,
      },
    ],
  });

  return chat.choices[0].message.content;
}

module.exports = { generateResponse };