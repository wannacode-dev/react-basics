const { useState, useEffect } = React;

function Book({ id }) {
    useEffect(() => {
        // Выполните запрос на получение книги по id. url: http://localhost:3000/api/books/${id}
        // Сохраните полученные данные в состояние.
        // Используйте fetch для выполнения запроса.
    
        // Обновите массив зависимостей, чтобы запрос выполнялся  при изменении id.
    }, []);

    return (
        <div>
            <h2>Название книги</h2>
            <p>Автор книги</p>
            <p>Цена книги</p>
        </div>
    )
}

function App() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/books')
            .then(response => response.json())
            .then(data => {
                setBooks(data);
            });
    }, []);

    return (
        <div>
            <h1>Книги</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <button onClick={() => setSelectedBook(book)}>{book.name}</button>
                    </li>
                ))}
            </ul>
            {selectedBook && <Book id={selectedBook.id} />}
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 