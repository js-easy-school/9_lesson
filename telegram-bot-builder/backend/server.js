const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const BotManager = require('./bot-manager');
const CodeGenerator = require('./code-generator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Хранилище активных ботов
const botManager = new BotManager();
const codeGenerator = new CodeGenerator();

// API endpoints

// Получить список всех ботов
app.get('/api/bots', (req, res) => {
  const bots = botManager.getAllBots();
  res.json(bots);
});

// Создать нового бота
app.post('/api/bots', (req, res) => {
  const { name, token, blocks } = req.body;

  if (!name || !token) {
    return res.status(400).json({ error: 'Name and token are required' });
  }

  try {
    const botId = uuidv4();
    const bot = {
      id: botId,
      name,
      token,
      blocks: blocks || [],
      status: 'stopped',
      createdAt: new Date().toISOString()
    };

    botManager.addBot(bot);
    res.json({ success: true, bot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить конфигурацию бота
app.put('/api/bots/:id', (req, res) => {
  const { id } = req.params;
  const { name, token, blocks } = req.body;

  try {
    const bot = botManager.getBot(id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (bot.status === 'running') {
      return res.status(400).json({ error: 'Cannot update running bot. Stop it first.' });
    }

    if (name) bot.name = name;
    if (token) bot.token = token;
    if (blocks) bot.blocks = blocks;

    res.json({ success: true, bot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запустить бота
app.post('/api/bots/:id/start', async (req, res) => {
  const { id } = req.params;

  try {
    const bot = botManager.getBot(id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (bot.status === 'running') {
      return res.status(400).json({ error: 'Bot is already running' });
    }

    // Генерируем код бота из блоков
    const botCode = codeGenerator.generate(bot.blocks);

    // Запускаем бота
    await botManager.startBot(id, bot.token, botCode);

    res.json({ success: true, message: 'Bot started successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Остановить бота
app.post('/api/bots/:id/stop', (req, res) => {
  const { id } = req.params;

  try {
    const bot = botManager.getBot(id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    botManager.stopBot(id);
    res.json({ success: true, message: 'Bot stopped successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить бота
app.delete('/api/bots/:id', (req, res) => {
  const { id } = req.params;

  try {
    const bot = botManager.getBot(id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (bot.status === 'running') {
      botManager.stopBot(id);
    }

    botManager.deleteBot(id);
    res.json({ success: true, message: 'Bot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Сгенерировать код бота (для предпросмотра)
app.post('/api/generate-code', (req, res) => {
  const { blocks } = req.body;

  try {
    const code = codeGenerator.generate(blocks);
    res.json({ success: true, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
