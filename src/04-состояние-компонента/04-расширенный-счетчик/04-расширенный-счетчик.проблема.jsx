const { useState } = React;

function Counter() {
    const [count, setCount] = useState(0);
    // Добавьте кнопку которая будет блокировать кнопку увеличить
    // Добавьте кнопку которая будет разблокировать кнопку увеличить
    // Добавьте кнопку которая будет сбрасывать счетчик
    return <div>
        <h1>Счетчик: {count}</h1>
        <button onClick={() => setCount(count + 1)}>Увеличить</button> 
    </div>;
}

function App() {
    return (
        <>
            {/* Передавайте начальное значение счетчика через пропсы */}
            <Counter />
            <Counter />
            <Counter />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);