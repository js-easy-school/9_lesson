import React, { useState } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import '../styles/BotSettings.css';

function BotSettings({ bot, onSave, onBack }) {
  const [name, setName] = useState(bot.name);
  const [token, setToken] = useState(bot.token);

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !token) {
      alert('Заполните все поля');
      return;
    }

    onSave({ name, token });
    alert('Настройки сохранены!');
  };

  return (
    <div className="bot-settings">
      <div className="settings-header">
        <button className="btn btn-secondary" onClick={onBack}>
          <FaArrowLeft /> Назад
        </button>
        <h2>Настройки бота</h2>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Название бота:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Мой супер бот"
            required
          />
        </div>

        <div className="form-group">
          <label>Токен из BotFather:</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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

        <div className="form-info">
          <h4>ℹ️ Информация о боте</h4>
          <p>
            <strong>ID:</strong> {bot.id}
          </p>
          <p>
            <strong>Статус:</strong>{' '}
            <span className={`status-badge status-${bot.status}`}>
              {bot.status === 'running' ? 'Запущен' : 'Остановлен'}
            </span>
          </p>
          <p>
            <strong>Блоков:</strong> {bot.blocks?.length || 0}
          </p>
          <p>
            <strong>Создан:</strong>{' '}
            {new Date(bot.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FaSave /> Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
}

export default BotSettings;
