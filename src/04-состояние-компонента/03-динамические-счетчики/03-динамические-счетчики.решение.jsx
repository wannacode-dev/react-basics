const { useState } = React;

function Counter({ counterValue }) {
    const [count, setCount] = useState(counterValue);

    return (
        <div>
            <h1>Счетчик: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Увеличить</button> 
        </div>
    );
}

function App() {
    const [counters, setCounters] = useState([0, 3, 4]);
    return (
        <>
            <button onClick={() => setCounters([...counters, 0])}>Добавить счетчик</button>
            <br />

            {
                counters.map((counter, index) => <Counter key={index} counterValue={counter}/>)
            }
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);