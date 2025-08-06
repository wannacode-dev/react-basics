const { useState, useEffect } = React;

function Book({ id }) {

    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/books/${id}`)
            .then(response => response.json())
            .then(data => {
                setBook(data);
            });
    }, [id]);

    return (
        <div>
            <h2>{book?.name}</h2>
            <p>{book?.author}</p>
            <p>{book?.price}</p>
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