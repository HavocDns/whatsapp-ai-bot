const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const axios = require('axios');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// Caminho do arquivo de autenticação
const { state, saveState } = useSingleFileAuthState('./auth.json');

// Sua chave da OpenRouter
const OPENROUTER_API_KEY = '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';

async function getAIResponse(message) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro na IA:', error.response?.data || error.message);
    return 'Desculpe, ocorreu um erro ao responder.';
  }
}

async function connectBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Mostra o QR para login
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    console.log('📩 Mensagem recebida:', text);

    const reply = await getAIResponse(text);
    await sock.sendMessage(from, { text: reply });
    console.log('✅ Resposta enviada');
  });
}

connectBot();
