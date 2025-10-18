import './style.css';

const { useState } = React;

function TodoList() {
    // Создайте состояние todos - массив с начальными задачами
    // Каждая задача: { id: number, text: string, completed: boolean }
    
    // Создайте состояние inputValue для поля ввода (начальное значение: '')
    
    const addTodo = () => {
        // Проверьте, что inputValue не пустой
        // Создайте новую задачу с уникальным id (используйте Date.now())
        // Добавьте её в массив todos
        // Очистите inputValue
    };
    
    const toggleTodo = (id) => {
        // Измените completed для задачи с данным id
        // Используйте map для создания нового массива
    };
    
    const deleteTodo = (id) => {
        // Удалите задачу с данным id из массива
        // Используйте filter
    };
    
    return (
        <div className="todo-container">
            <h1>✅ Мой TODO List</h1>
            
            {/* Форма добавления */}
            <div className="todo-form">
                <input 
                    type="text"
                    value={''} // inputValue
                    onChange={() => {}} // setInputValue
                    placeholder="Что нужно сделать?"
                    className="todo-input"
                />
                <button onClick={addTodo} className="add-button">
                    Добавить
                </button>
            </div>
            
            {/* Список задач - используйте map для отображения всех todos */}
            <ul className="todo-list">
                {/* Для каждой задачи создайте li с классом "todo-item" */}
                {/* Добавьте чекбокс, текст задачи и кнопку удаления */}
            </ul>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <TodoList />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
