const TelegramBot = require('node-telegram-bot-api');

class BotManager {
  constructor() {
    this.bots = new Map(); // Хранит конфигурации ботов
    this.runningBots = new Map(); // Хранит запущенные инстансы ботов
  }

  // Добавить бота
  addBot(bot) {
    this.bots.set(bot.id, bot);
  }

  // Получить бота
  getBot(id) {
    return this.bots.get(id);
  }

  // Получить всех ботов
  getAllBots() {
    return Array.from(this.bots.values());
  }

  // Удалить бота
  deleteBot(id) {
    this.bots.delete(id);
    this.runningBots.delete(id);
  }

  // Запустить бота
  async startBot(id, token, botLogic) {
    const bot = this.bots.get(id);
    if (!bot) {
      throw new Error('Bot not found');
    }

    if (this.runningBots.has(id)) {
      throw new Error('Bot is already running');
    }

    try {
      // Создаем инстанс Telegram бота
      const telegramBot = new TelegramBot(token, { polling: true });

      // Применяем сгенерированную логику
      botLogic(telegramBot);

      // Сохраняем инстанс
      this.runningBots.set(id, telegramBot);

      // Обновляем статус
      bot.status = 'running';

      console.log(`✅ Bot "${bot.name}" started successfully`);
    } catch (error) {
      bot.status = 'error';
      throw new Error(`Failed to start bot: ${error.message}`);
    }
  }

  // Остановить бота
  stopBot(id) {
    const bot = this.bots.get(id);
    if (!bot) {
      throw new Error('Bot not found');
    }

    const runningBot = this.runningBots.get(id);
    if (runningBot) {
      // Останавливаем polling
      runningBot.stopPolling();

      // Удаляем инстанс
      this.runningBots.delete(id);

      // Обновляем статус
      bot.status = 'stopped';

      console.log(`⛔ Bot "${bot.name}" stopped`);
    }
  }

  // Перезапустить бота
  async restartBot(id, token, botLogic) {
    this.stopBot(id);
    await this.startBot(id, token, botLogic);
  }
}

module.exports = BotManager;
