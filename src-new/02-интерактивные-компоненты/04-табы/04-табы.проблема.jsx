import './style.css';

const { useState } = React;

function Tabs() {
    // Создайте состояние activeTab со значением 'profile', 'posts' или 'settings'
    // Начальное значение: 'profile'
    
    const tabs = [
        { id: 'profile', label: '👤 Профиль' },
        { id: 'posts', label: '📝 Посты' },
        { id: 'settings', label: '⚙️ Настройки' }
    ];
    
    return (
        <div className="tabs-container">
            <h1>Навигация по табам</h1>
            
            {/* Кнопки табов */}
            <div className="tabs-buttons">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {/* Установите activeTab в tab.id */}}
                        className="tab-button"
                        // Добавьте класс 'active' если activeTab === tab.id
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            {/* Контент табов */}
            <div className="tabs-content">
                {/* Используйте условный рендеринг для отображения нужного контента */}
                
                {/* Если activeTab === 'profile' */}
                <div>
                    <h2>👤 Профиль пользователя</h2>
                    <p>Имя: Иван Иванов</p>
                    <p>Email: ivan@example.com</p>
                    <p>Регистрация: 15.03.2024</p>
                </div>
                
                {/* Если activeTab === 'posts' */}
                {/* <div>
                    <h2>📝 Мои посты</h2>
                    <div className="posts-list">...</div>
                </div> */}
                
                {/* Если activeTab === 'settings' */}
                {/* <div>
                    <h2>⚙️ Настройки</h2>
                    <div>...</div>
                </div> */}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <Tabs />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
