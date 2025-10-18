import './style.css';

const { useState } = React;

function ThemeSwitcher() {
    const [theme, setTheme] = useState('light');
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    
    return (
        <div className={`theme-container ${theme}`}>
            <h1>
                {theme === 'dark' ? '🌙' : '☀️'} Переключатель темы
            </h1>
            
            <p>
                Текущая тема: <strong>{theme === 'dark' ? 'Тёмная' : 'Светлая'}</strong>
            </p>
            
            <button
                onClick={toggleTheme}
                className={`theme-toggle-button ${theme}`}
            >
                {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            
            <div className={`demo-content ${theme}`}>
                <h3>✨ Демо контент</h3>
                <p>
                    Этот текст меняет цвет в зависимости от темы.
                    Попробуйте переключить тему и посмотрите, как изменится весь интерфейс!
                </p>
                <p>
                    {theme === 'dark' 
                        ? '🌙 Тёмная тема помогает глазам в ночное время' 
                        : '☀️ Светлая тема отлично подходит для дневного использования'
                    }
                </p>
            </div>
        </div>
    );
}

function App() {
    return <ThemeSwitcher />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
