import './style.css';

const { useState, useEffect, useRef } = React;

// Начальные сообщения
const INITIAL_MESSAGES = [
    { id: 1, text: 'Привет! Как дела?', sender: 'bot', time: '10:00' },
    { id: 2, text: 'Отлично! А у тебя?', sender: 'user', time: '10:01' },
];

function ChatInterface() {
    // Создайте состояния:
    // - messages (массив сообщений, начальное: INITIAL_MESSAGES)
    // - inputValue (текст в поле ввода, начальное: '')
    // - isTyping (печатает ли бот, начальное: false)
    
    // Создайте ref для автоскролла:
    const messagesEndRef = useRef(null);
    
    // Автоскролл при изменении messages
    useEffect(() => {
        // Вызовите scrollToBottom()
    }, [/* зависимости */]);
    
    const scrollToBottom = () => {
        // Прокрутите к messagesEndRef
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const sendMessage = (e) => {
        e.preventDefault();
        
        // Проверьте, что inputValue не пустой
        
        // Создайте новое сообщение:
        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        
        // Добавьте сообщение в массив messages
        // Очистите inputValue
        
        // Имитация ответа бота (опционально):
        // - Установите isTyping в true
        // - Через setTimeout (1-2 сек) добавьте ответ бота
        // - Установите isTyping в false
    };
    
    return (
        <div className="chat-container">
            {/* Заголовок */}
            <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div className="chat-info">
                    <h2>Чат-бот Помощник</h2>
                    <p>Всегда на связи</p>
                </div>
            </div>
            
            {/* Сообщения */}
            <div className="chat-messages">
                {/* Отобразите все messages */}
                {/* Для каждого сообщения:
                    - Используйте класс "message sent" для user
                    - Используйте класс "message received" для bot
                    - Покажите аватар, текст и время
                */}
                
                {/* Индикатор печатания (если isTyping === true) */}
                
                {/* Элемент для автоскролла */}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Форма отправки */}
            <form onSubmit={sendMessage} className="chat-input-form">
                <input 
                    type="text"
                    value={''} // inputValue
                    onChange={() => {}} // setInputValue
                    placeholder="Введите сообщение..."
                    className="chat-input"
                />
                <button 
                    type="submit"
                    disabled={false} // заблокируйте если inputValue пустой
                    className="send-button"
                >
                    ➤
                </button>
            </form>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <ChatInterface />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

