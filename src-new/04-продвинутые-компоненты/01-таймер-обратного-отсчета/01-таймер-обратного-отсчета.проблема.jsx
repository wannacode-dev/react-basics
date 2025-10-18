import './style.css';

const { useState, useEffect } = React;

function CountdownTimer() {
    // Создайте состояния:
    // - inputMinutes (число минут для установки, начальное: 1)
    // - timeLeft (оставшееся время в секундах, начальное: 60)
    // - isRunning (запущен ли таймер, начальное: false)
    // - isPaused (на паузе ли таймер, начальное: false)
    // - initialTime (начальное время для прогресс-бара, начальное: 60)
    
    // Используйте useEffect для создания таймера:
    useEffect(() => {
        // Если таймер не запущен или на паузе - ничего не делаем
        // Если время вышло - останавливаем таймер
        
        // Создайте setInterval, который каждую секунду:
        // - Уменьшает timeLeft на 1
        // - Если timeLeft достиг 0 - останавливает таймер
        
        // ВАЖНО: Верните cleanup функцию, которая очищает интервал
        // return () => clearInterval(timer);
    }, [/* зависимости */]);
    
    const startTimer = () => {
        // Запустите таймер
        // Установите isRunning в true, isPaused в false
    };
    
    const pauseTimer = () => {
        // Поставьте на паузу (isPaused = true)
    };
    
    const resumeTimer = () => {
        // Снимите с паузы (isPaused = false)
    };
    
    const stopTimer = () => {
        // Остановите таймер и обнулите время
    };
    
    const resetTimer = () => {
        // Сбросьте таймер к начальному значению
    };
    
    // Функция форматирования времени в MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    return (
        <div className="timer-card">
            <h1>⏰ Таймер обратного отсчёта</h1>
            
            {/* Поле ввода (показывать только если таймер не запущен) */}
            <div className="input-section">
                <label>Установите время (минуты):</label>
                <input 
                    type="number"
                    min="1"
                    max="99"
                    value={1} // inputMinutes
                    onChange={() => {}} // Обновите inputMinutes и timeLeft
                />
            </div>
            
            {/* Дисплей времени */}
            <div className="timer-display">
                {formatTime(60)} {/* Используйте timeLeft */}
            </div>
            
            {/* Кнопки управления */}
            <div className="controls">
                {/* Кнопка Старт (если не запущен) */}
                <button 
                    onClick={startTimer}
                    className="control-button start"
                >
                    ▶️ Старт
                </button>
                
                {/* Кнопка Пауза (если запущен и не на паузе) */}
                {/* Кнопка Продолжить (если на паузе) */}
                {/* Кнопка Стоп (если запущен) */}
                {/* Кнопка Сброс (если время изменилось) */}
            </div>
            
            {/* Статус */}
            <div className="timer-status idle">
                ⚪ Готов к запуску
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <CountdownTimer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

