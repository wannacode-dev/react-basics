const { useState, useEffect } = React;

function App() {
    const [books, setBooks] = useState([]);

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
                    <li key={book.id}>{book.name}</li>
                ))}
            </ul>
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 