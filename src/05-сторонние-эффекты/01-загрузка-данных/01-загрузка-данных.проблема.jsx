const { useState, useEffect } = React;

function App() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Выполните запрос на получение списка книг. url: http://localhost:3000/api/books
        // Сохраните полученные данные в состояние.
    }, []);

    return (
        <div>
            <h1>Книги</h1>
            <ul>
                {/**
                 * Выведите названия книг.
                 * Каждая книга должна быть представлена в виде li.
                 * Добавьте key для каждой книги.
                 */}
            </ul>
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 