import React, { useState } from 'react';
import { FaPlay, FaStop, FaEdit, FaCog, FaTrash, FaPlus } from 'react-icons/fa';
import '../styles/BotList.css';

function BotList({
  bots,
  loading,
  onCreateBot,
  onEditBot,
  onSettingsBot,
  onStartBot,
  onStopBot,
  onDeleteBot
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [newBotToken, setNewBotToken] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();

    if (!newBotName || !newBotToken) {
      alert('Заполните все поля');
      return;
    }

    onCreateBot(newBotName, newBotToken);
    setNewBotName('');
    setNewBotToken('');
    setShowCreateForm(false);
  };

  return (
    <div className="bot-list">
      <div className="bot-list-header">
        <h2>Мои боты</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <FaPlus /> Создать бота
        </button>
      </div>

      {showCreateForm && (
        <form className="create-bot-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label>Название бота:</label>
            <input
              type="text"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="Мой супер бот"
              required
            />
          </div>

          <div className="form-group">
            <label>Токен из BotFather:</label>
            <input
              type="text"
              value={newBotToken}
              onChange={(e) => setNewBotToken(e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              required
            />
            <small>
              Получите токен у{' '}
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
              >
                @BotFather
              </a>
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Создать
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : bots.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет ботов</p>
          <p>Создайте первого бота, чтобы начать!</p>
        </div>
      ) : (
        <div className="bots-grid">
          {bots.map((bot) => (
            <div key={bot.id} className="bot-card">
              <div className="bot-card-header">
                <h3>{bot.name}</h3>
                <span className={`status-badge status-${bot.status}`}>
                  {bot.status === 'running' ? '🟢 Запущен' : '⚫ Остановлен'}
                </span>
              </div>

              <div className="bot-card-info">
                <p>
                  <strong>Блоков:</strong> {bot.blocks?.length || 0}
                </p>
                <p>
                  <strong>Создан:</strong>{' '}
                  {new Date(bot.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="bot-card-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => onEditBot(bot)}
                  title="Редактировать"
                >
                  <FaEdit />
                </button>

                <button
                  className="btn btn-icon"
                  onClick={() => onSettingsBot(bot)}
                  title="Настройки"
                >
                  <FaCog />
                </button>

                {bot.status === 'running' ? (
                  <button
                    className="btn btn-icon btn-danger"
                    onClick={() => onStopBot(bot.id)}
                    title="Остановить"
                  >
                    <FaStop />
                  </button>
                ) : (
                  <button
                    className="btn btn-icon btn-success"
                    onClick={() => onStartBot(bot.id)}
                    title="Запустить"
                    disabled={!bot.blocks || bot.blocks.length === 0}
                  >
                    <FaPlay />
                  </button>
                )}

                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => onDeleteBot(bot.id)}
                  title="Удалить"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BotList;
