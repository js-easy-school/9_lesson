import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaArrowLeft, FaSave, FaPlay, FaTrash, FaPlus } from 'react-icons/fa';
import BlockEditor from './BlockEditor';
import '../styles/BotBuilder.css';

const BLOCK_TYPES = [
  { type: 'start', label: '▶️ Start команда', icon: '▶️' },
  { type: 'command', label: '⚡ Команда', icon: '⚡' },
  { type: 'message', label: '💬 Сообщение', icon: '💬' },
  { type: 'keyboard', label: '⌨️ Клавиатура', icon: '⌨️' },
  { type: 'button', label: '🔘 Кнопка', icon: '🔘' },
  { type: 'photo', label: '🖼️ Фото', icon: '🖼️' },
];

function BotBuilder({ bot, onSave, onBack, onStart }) {
  const [blocks, setBlocks] = useState(bot.blocks || []);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setBlocks(bot.blocks || []);
  }, [bot]);

  // Добавить блок
  const addBlock = (blockType) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      data: getDefaultBlockData(blockType)
    };

    setBlocks([...blocks, newBlock]);
    setHasChanges(true);
  };

  // Получить дефолтные данные для блока
  const getDefaultBlockData = (type) => {
    const defaults = {
      start: {
        message: 'Привет! Я бот, созданный в визуальном конструкторе.'
      },
      command: {
        command: 'help',
        response: 'Справка по командам'
      },
      message: {
        trigger: '',
        response: 'Ответ на сообщение'
      },
      keyboard: {
        trigger: '/keyboard',
        buttons: [['Кнопка 1', 'Кнопка 2'], ['Кнопка 3']]
      },
      button: {
        buttonText: 'Нажми меня',
        callbackData: 'button_click',
        response: 'Кнопка нажата!'
      },
      photo: {
        trigger: '/photo',
        photoUrl: 'https://picsum.photos/400/300',
        caption: 'Вот ваше фото'
      }
    };

    return defaults[type] || {};
  };

  // Удалить блок
  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    setHasChanges(true);
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  // Обновить блок
  const updateBlock = (blockId, data) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, data } : b
    ));
    setHasChanges(true);
  };

  // Drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
    setHasChanges(true);
  };

  // Сохранить
  const handleSave = () => {
    onSave(blocks);
    setHasChanges(false);
    alert('Бот сохранен!');
  };

  // Сохранить и запустить
  const handleSaveAndStart = () => {
    onSave(blocks);
    setHasChanges(false);
    onStart();
  };

  return (
    <div className="bot-builder">
      <div className="builder-header">
        <button className="btn btn-secondary" onClick={onBack}>
          <FaArrowLeft /> Назад
        </button>

        <h2>{bot.name}</h2>

        <div className="builder-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <FaSave /> Сохранить
          </button>

          <button
            className="btn btn-success"
            onClick={handleSaveAndStart}
            disabled={blocks.length === 0}
          >
            <FaPlay /> Сохранить и запустить
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Панель блоков */}
        <div className="blocks-palette">
          <h3>Блоки</h3>
          <p className="palette-hint">Нажмите, чтобы добавить блок</p>

          <div className="blocks-list">
            {BLOCK_TYPES.map((blockType) => (
              <button
                key={blockType.type}
                className="block-type-btn"
                onClick={() => addBlock(blockType.type)}
              >
                <span className="block-icon">{blockType.icon}</span>
                <span>{blockType.label}</span>
              </button>
            ))}
          </div>

          <div className="palette-info">
            <h4>Как использовать:</h4>
            <ol>
              <li>Добавьте блоки</li>
              <li>Настройте каждый блок</li>
              <li>Сохраните изменения</li>
              <li>Запустите бота</li>
            </ol>
          </div>
        </div>

        {/* Рабочая область */}
        <div className="blocks-workspace">
          <h3>Логика бота ({blocks.length} блоков)</h3>

          {blocks.length === 0 ? (
            <div className="empty-workspace">
              <p>Добавьте блоки из панели слева</p>
              <p>чтобы создать логику бота</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div
                    className="blocks-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {blocks.map((block, index) => (
                      <Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`block-item ${
                              snapshot.isDragging ? 'dragging' : ''
                            } ${
                              selectedBlock?.id === block.id ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedBlock(block)}
                          >
                            <div className="block-header">
                              <span className="block-number">#{index + 1}</span>
                              <span className="block-type">
                                {BLOCK_TYPES.find(t => t.type === block.type)?.icon}{' '}
                                {BLOCK_TYPES.find(t => t.type === block.type)?.label}
                              </span>
                              <button
                                className="btn-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBlock(block.id);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="block-preview">
                              {block.data.message && <p>📝 {block.data.message}</p>}
                              {block.data.command && <p>⚡ /{block.data.command}</p>}
                              {block.data.response && <p>💬 {block.data.response}</p>}
                              {block.data.trigger && <p>🔔 Триггер: {block.data.trigger}</p>}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Редактор блока */}
        <div className="block-editor-panel">
          {selectedBlock ? (
            <BlockEditor
              block={selectedBlock}
              onUpdate={(data) => updateBlock(selectedBlock.id, data)}
              onClose={() => setSelectedBlock(null)}
            />
          ) : (
            <div className="no-selection">
              <p>Выберите блок для редактирования</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BotBuilder;
