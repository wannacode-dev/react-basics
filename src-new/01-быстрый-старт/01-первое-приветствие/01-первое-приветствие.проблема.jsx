import './style.css';

const { useState } = React;

function WelcomeCard() {
    // Создайте переменные:
    // name - ваше имя
    // role - ваша роль (например, "Frontend разработчик")
    // emoji - эмодзи (например, "👋")
    
    return (
        <div className="welcome-card">
            {/* Выведите эмодзи с классом "emoji" */}
            
            {/* Выведите приветствие: "Привет! Я {name}" с классом "title" */}
            
            {/* Выведите роль с классом "role" */}
            
            {/* Добавьте параграф с текстом: "Добро пожаловать в мир React!" с классом "description" */}
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <WelcomeCard />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
