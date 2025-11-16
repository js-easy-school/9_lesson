class CodeGenerator {
  constructor() {
    this.blockHandlers = {
      start: this.generateStartBlock,
      message: this.generateMessageBlock,
      command: this.generateCommandBlock,
      button: this.generateButtonBlock,
      keyboard: this.generateKeyboardBlock,
      photo: this.generatePhotoBlock,
      condition: this.generateConditionBlock,
      variable: this.generateVariableBlock,
    };
  }

  // Главный метод генерации
  generate(blocks) {
    if (!blocks || blocks.length === 0) {
      return (bot) => {
        bot.on('message', (msg) => {
          bot.sendMessage(msg.chat.id, 'Бот пока не настроен. Добавьте блоки в конструкторе.');
        });
      };
    }

    // Генерируем код из блоков
    const code = this.generateCode(blocks);

    // Возвращаем функцию, которая настраивает бота
    return new Function('bot', code);
  }

  generateCode(blocks) {
    let code = '';
    const variables = {};

    // Обрабатываем каждый блок
    for (const block of blocks) {
      const handler = this.blockHandlers[block.type];
      if (handler) {
        code += handler.call(this, block, variables) + '\n\n';
      }
    }

    return code;
  }

  // Блок /start команды
  generateStartBlock(block) {
    const message = block.data?.message || 'Привет! Я бот, созданный в визуальном конструкторе.';
    return `
      bot.onText(/\\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, ${JSON.stringify(message)});
      });
    `;
  }

  // Блок отправки сообщения
  generateMessageBlock(block) {
    const trigger = block.data?.trigger || '';
    const response = block.data?.response || 'Ответ не настроен';

    if (trigger) {
      return `
        bot.onText(/${this.escapeRegex(trigger)}/i, (msg) => {
          const chatId = msg.chat.id;
          bot.sendMessage(chatId, ${JSON.stringify(response)});
        });
      `;
    } else {
      return `
        bot.on('message', (msg) => {
          const chatId = msg.chat.id;
          if (!msg.text.startsWith('/')) {
            bot.sendMessage(chatId, ${JSON.stringify(response)});
          }
        });
      `;
    }
  }

  // Блок команды
  generateCommandBlock(block) {
    const command = block.data?.command || 'help';
    const response = block.data?.response || 'Справка';

    return `
      bot.onText(/\\/${command}/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, ${JSON.stringify(response)});
      });
    `;
  }

  // Блок кнопки
  generateButtonBlock(block) {
    const buttonText = block.data?.buttonText || 'Кнопка';
    const callbackData = block.data?.callbackData || 'button_click';
    const response = block.data?.response || 'Кнопка нажата';

    return `
      bot.on('callback_query', (query) => {
        if (query.data === ${JSON.stringify(callbackData)}) {
          bot.answerCallbackQuery(query.id);
          bot.sendMessage(query.message.chat.id, ${JSON.stringify(response)});
        }
      });
    `;
  }

  // Блок клавиатуры
  generateKeyboardBlock(block) {
    const buttons = block.data?.buttons || [['Кнопка 1', 'Кнопка 2']];
    const trigger = block.data?.trigger || '';

    const keyboard = {
      keyboard: buttons,
      resize_keyboard: true,
      one_time_keyboard: false
    };

    if (trigger) {
      return `
        bot.onText(/${this.escapeRegex(trigger)}/i, (msg) => {
          const chatId = msg.chat.id;
          bot.sendMessage(chatId, 'Выберите опцию:', {
            reply_markup: ${JSON.stringify(keyboard)}
          });
        });
      `;
    } else {
      return `
        bot.on('message', (msg) => {
          const chatId = msg.chat.id;
          if (msg.text === '/keyboard') {
            bot.sendMessage(chatId, 'Выберите опцию:', {
              reply_markup: ${JSON.stringify(keyboard)}
            });
          }
        });
      `;
    }
  }

  // Блок отправки фото
  generatePhotoBlock(block) {
    const trigger = block.data?.trigger || '';
    const photoUrl = block.data?.photoUrl || '';
    const caption = block.data?.caption || '';

    if (!photoUrl) return '';

    return `
      bot.onText(/${this.escapeRegex(trigger)}/i, (msg) => {
        const chatId = msg.chat.id;
        bot.sendPhoto(chatId, ${JSON.stringify(photoUrl)}, {
          caption: ${JSON.stringify(caption)}
        });
      });
    `;
  }

  // Блок условия
  generateConditionBlock(block) {
    const condition = block.data?.condition || 'msg.text.length > 10';
    const trueResponse = block.data?.trueResponse || 'Условие выполнено';
    const falseResponse = block.data?.falseResponse || 'Условие не выполнено';

    return `
      bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if (${condition}) {
          bot.sendMessage(chatId, ${JSON.stringify(trueResponse)});
        } else {
          bot.sendMessage(chatId, ${JSON.stringify(falseResponse)});
        }
      });
    `;
  }

  // Блок переменной
  generateVariableBlock(block, variables) {
    const varName = block.data?.name || 'myVar';
    const varValue = block.data?.value || '';

    variables[varName] = varValue;

    return `
      let ${varName} = ${JSON.stringify(varValue)};
    `;
  }

  // Вспомогательная функция для экранирования regex
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = CodeGenerator;
