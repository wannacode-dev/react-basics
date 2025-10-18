import './style.css';

const { useState } = React;

function AccordionItem({ title, content }) {
    // Создайте состояние isOpen (boolean, начальное значение false)
    
    const toggleOpen = () => {
        // Переключайте isOpen между true и false
    };
    
    return (
        <div className="accordion-item">
            {/* Заголовок (всегда видимый, кликабельный) */}
            <button
                onClick={toggleOpen}
                className="accordion-header"
                // Добавьте класс 'open' если isOpen === true
            >
                {title}
                <span className="accordion-icon">
                    {/* Покажите ▼ если isOpen, иначе ▶ */}
                    ▶
                </span>
            </button>
            
            {/* Контент (показывать только если isOpen === true) */}
            {/* Используйте условный рендеринг */}
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <div className="accordion-container">
                <h1>❓ Часто задаваемые вопросы</h1>
                
                <AccordionItem 
                    title="Что такое React?"
                    content="React — это JavaScript библиотека для создания пользовательских интерфейсов. Разработана Facebook и используется миллионами разработчиков по всему миру."
                />
                
                <AccordionItem 
                    title="Зачем нужен useState?"
                    content="useState — это хук, который позволяет компонентам 'помнить' информацию между перерисовками. Это основа создания интерактивных компонентов в React."
                />
                
                <AccordionItem 
                    title="Что такое JSX?"
                    content="JSX — это расширение синтаксиса JavaScript, которое позволяет писать HTML-подобный код прямо в JavaScript. Он делает код более читаемым и удобным."
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
