import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/BlockEditor.css';

function BlockEditor({ block, onUpdate, onClose }) {
  const [data, setData] = useState(block.data);

  useEffect(() => {
    setData(block.data);
  }, [block]);

  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(newData);
  };

  const handleArrayChange = (field, value) => {
    // Преобразуем строку в массив массивов для клавиатуры
    const rows = value.split('\n').filter(row => row.trim());
    const buttons = rows.map(row => row.split(',').map(btn => btn.trim()));
    handleChange(field, buttons);
  };

  const renderFields = () => {
    switch (block.type) {
      case 'start':
        return (
          <div className="form-group">
            <label>Приветственное сообщение:</label>
            <textarea
              value={data.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Привет! Я бот..."
              rows={4}
            />
          </div>
        );

      case 'command':
        return (
          <>
            <div className="form-group">
              <label>Команда (без /):</label>
              <input
                type="text"
                value={data.command || ''}
                onChange={(e) => handleChange('command', e.target.value)}
                placeholder="help"
              />
            </div>
            <div className="form-group">
              <label>Ответ на команду:</label>
              <textarea
                value={data.response || ''}
                onChange={(e) => handleChange('response', e.target.value)}
                placeholder="Справка по командам"
                rows={4}
              />
            </div>
          </>
        );

      case 'message':
        return (
          <>
            <div className="form-group">
              <label>Триггер (ключевое слово):</label>
              <input
                type="text"
                value={data.trigger || ''}
                onChange={(e) => handleChange('trigger', e.target.value)}
                placeholder="привет"
              />
              <small>Оставьте пустым для ответа на любое сообщение</small>
            </div>
            <div className="form-group">
              <label>Ответ:</label>
              <textarea
                value={data.response || ''}
                onChange={(e) => handleChange('response', e.target.value)}
                placeholder="Ответ на сообщение"
                rows={4}
              />
            </div>
          </>
        );

      case 'keyboard':
        return (
          <>
            <div className="form-group">
              <label>Триггер (команда для показа клавиатуры):</label>
              <input
                type="text"
                value={data.trigger || ''}
                onChange={(e) => handleChange('trigger', e.target.value)}
                placeholder="/keyboard"
              />
            </div>
            <div className="form-group">
              <label>Кнопки (каждая строка - ряд, запятые - разные кнопки):</label>
              <textarea
                value={
                  data.buttons
                    ? data.buttons.map(row => row.join(', ')).join('\n')
                    : ''
                }
                onChange={(e) => handleArrayChange('buttons', e.target.value)}
                placeholder="Кнопка 1, Кнопка 2&#10;Кнопка 3"
                rows={4}
              />
              <small>Пример: "Да, Нет" (в одной строке - кнопки рядом)</small>
            </div>
          </>
        );

      case 'button':
        return (
          <>
            <div className="form-group">
              <label>Текст кнопки:</label>
              <input
                type="text"
                value={data.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Нажми меня"
              />
            </div>
            <div className="form-group">
              <label>Callback data (ID кнопки):</label>
              <input
                type="text"
                value={data.callbackData || ''}
                onChange={(e) => handleChange('callbackData', e.target.value)}
                placeholder="button_click"
              />
            </div>
            <div className="form-group">
              <label>Ответ при нажатии:</label>
              <textarea
                value={data.response || ''}
                onChange={(e) => handleChange('response', e.target.value)}
                placeholder="Кнопка нажата!"
                rows={3}
              />
            </div>
          </>
        );

      case 'photo':
        return (
          <>
            <div className="form-group">
              <label>Триггер (команда):</label>
              <input
                type="text"
                value={data.trigger || ''}
                onChange={(e) => handleChange('trigger', e.target.value)}
                placeholder="/photo"
              />
            </div>
            <div className="form-group">
              <label>URL фото:</label>
              <input
                type="text"
                value={data.photoUrl || ''}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="form-group">
              <label>Подпись к фото:</label>
              <textarea
                value={data.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
                placeholder="Вот ваше фото"
                rows={2}
              />
            </div>
          </>
        );

      default:
        return <p>Неизвестный тип блока</p>;
    }
  };

  return (
    <div className="block-editor">
      <div className="editor-header">
        <h3>Редактор блока</h3>
        <button className="btn-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="editor-content">
        <div className="block-type-label">
          Тип: <strong>{block.type}</strong>
        </div>

        {renderFields()}
      </div>
    </div>
  );
}

export default BlockEditor;
