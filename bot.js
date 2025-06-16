const venom = require('venom-bot');
const axios = require('axios');

const OPENROUTER_API_KEY = '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'; // 

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
    console.error('Erro na chamada da IA:', error.response?.data || error.message);
    return 'Desculpe, não consegui responder agora.';
  }
}

venom
  .create({
    session: 'whatsapp-bot',
    headless: true, // 👈 Agora em modo headless (sem interface)
    useChrome: true,
    protocolTimeout: 60000,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  })
  .then(client => start(client))
  .catch(error => console.error('Erro ao iniciar o Venom:', error));

function start(client) {
  console.log('🤖 Bot iniciado!');

  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      console.log('📨 Mensagem recebida:', message.body);

      const reply = await getAIResponse(message.body);
      await client.sendText(message.from, reply);
      console.log('✅ Resposta enviada');
    }
  });
}
