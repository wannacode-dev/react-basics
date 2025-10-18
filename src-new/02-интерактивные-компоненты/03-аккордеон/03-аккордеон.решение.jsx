import './style.css';

const { useState } = React;

function AccordionItem({ title, content }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className="accordion-item">
            <button
                onClick={toggleOpen}
                className={`accordion-header ${isOpen ? 'open' : ''}`}
            >
                {title}
                <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                    {isOpen ? '▼' : '▶'}
                </span>
            </button>
            
            {isOpen && (
                <div className="accordion-content">
                    {content}
                </div>
            )}
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
                    content="React — это JavaScript библиотека для создания пользовательских интерфейсов. Разработана Facebook (Meta) в 2013 году и используется миллионами разработчиков по всему миру для создания современных веб-приложений."
                />
                
                <AccordionItem 
                    title="Зачем нужен useState?"
                    content="useState — это хук, который позволяет функциональным компонентам 'помнить' информацию между перерисовками. Это основа создания интерактивных компонентов в React. Без состояния компоненты были бы просто статичными элементами."
                />
                
                <AccordionItem 
                    title="Что такое JSX?"
                    content="JSX (JavaScript XML) — это расширение синтаксиса JavaScript, которое позволяет писать HTML-подобный код прямо в JavaScript файлах. Babel преобразует JSX в обычные вызовы React.createElement(), но JSX делает код намного более читаемым и удобным."
                />
                
                <AccordionItem 
                    title="Как работает Virtual DOM?"
                    content="Virtual DOM — это легковесная копия реального DOM в памяти. React сравнивает текущий Virtual DOM с предыдущим, вычисляет минимальные изменения и применяет только их к реальному DOM. Это делает обновления очень быстрыми и эффективными."
                />
                
                <AccordionItem 
                    title="Нужно ли знать JavaScript для React?"
                    content="Да! Для эффективной работы с React нужно хорошо знать современный JavaScript: стрелочные функции, деструктуризацию, spread оператор, методы массивов (map, filter), async/await и ES6+ синтаксис."
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
