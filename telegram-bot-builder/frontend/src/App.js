import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BotList from './components/BotList';
import BotBuilder from './components/BotBuilder';
import BotSettings from './components/BotSettings';
import './styles/App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'builder', 'settings'
  const [loading, setLoading] = useState(false);

  // Загрузка списка ботов
  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bots`);
      setBots(response.data);
    } catch (error) {
      console.error('Error loading bots:', error);
      alert('Ошибка при загрузке ботов');
    } finally {
      setLoading(false);
    }
  };

  // Создать нового бота
  const createBot = async (name, token) => {
    try {
      const response = await axios.post(`${API_URL}/bots`, {
        name,
        token,
        blocks: []
      });

      setBots([...bots, response.data.bot]);
      setSelectedBot(response.data.bot);
      setView('builder');
    } catch (error) {
      console.error('Error creating bot:', error);
      alert('Ошибка при создании бота');
    }
  };

  // Обновить бота
  const updateBot = async (botId, updates) => {
    try {
      await axios.put(`${API_URL}/bots/${botId}`, updates);

      const updatedBots = bots.map(bot =>
        bot.id === botId ? { ...bot, ...updates } : bot
      );
      setBots(updatedBots);

      if (selectedBot && selectedBot.id === botId) {
        setSelectedBot({ ...selectedBot, ...updates });
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      alert('Ошибка при обновлении бота: ' + error.response?.data?.error);
    }
  };

  // Запустить бота
  const startBot = async (botId) => {
    try {
      await axios.post(`${API_URL}/bots/${botId}/start`);
      await loadBots();
      alert('Бот успешно запущен!');
    } catch (error) {
      console.error('Error starting bot:', error);
      alert('Ошибка при запуске бота: ' + error.response?.data?.error);
    }
  };

  // Остановить бота
  const stopBot = async (botId) => {
    try {
      await axios.post(`${API_URL}/bots/${botId}/stop`);
      await loadBots();
      alert('Бот остановлен');
    } catch (error) {
      console.error('Error stopping bot:', error);
      alert('Ошибка при остановке бота');
    }
  };

  // Удалить бота
  const deleteBot = async (botId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого бота?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/bots/${botId}`);
      setBots(bots.filter(bot => bot.id !== botId));

      if (selectedBot && selectedBot.id === botId) {
        setSelectedBot(null);
        setView('list');
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
      alert('Ошибка при удалении бота');
    }
  };

  // Открыть конструктор
  const openBuilder = (bot) => {
    setSelectedBot(bot);
    setView('builder');
  };

  // Открыть настройки
  const openSettings = (bot) => {
    setSelectedBot(bot);
    setView('settings');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Telegram Bot Builder</h1>
        <p>Визуальный конструктор ботов из блоков</p>
      </header>

      <div className="app-content">
        {view === 'list' && (
          <BotList
            bots={bots}
            loading={loading}
            onCreateBot={createBot}
            onEditBot={openBuilder}
            onSettingsBot={openSettings}
            onStartBot={startBot}
            onStopBot={stopBot}
            onDeleteBot={deleteBot}
          />
        )}

        {view === 'builder' && selectedBot && (
          <BotBuilder
            bot={selectedBot}
            onSave={(blocks) => updateBot(selectedBot.id, { blocks })}
            onBack={() => setView('list')}
            onStart={() => startBot(selectedBot.id)}
          />
        )}

        {view === 'settings' && selectedBot && (
          <BotSettings
            bot={selectedBot}
            onSave={(updates) => updateBot(selectedBot.id, updates)}
            onBack={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
