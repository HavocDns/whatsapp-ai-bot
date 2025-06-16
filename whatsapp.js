const axios = require("axios");

async function sendWhatsAppMessage(phone, message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: message },
  };

  try {
    await axios.post(`https://graph.facebook.com/v18.0/${phoneId}/messages`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.response.data);
  }
}

module.exports = { sendWhatsAppMessage };