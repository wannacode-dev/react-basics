const { useState } = React;

function App() {
    // Добавьте хук useState для создания переменной count

    return <div>
        {/* Добавьте текст, который будет отображать значение: "Счетчик: 0" */}
        <h1>Счетчик</h1>
        {/* Добавьте кнопку, которая будет увеличивать значение count на 1 */}
        <button>Увеличить</button> 
    </div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);