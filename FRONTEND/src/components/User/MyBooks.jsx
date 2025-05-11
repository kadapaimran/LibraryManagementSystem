import { useState, useEffect } from 'react';

function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/my_books', {
      headers: { 'Authorization': 'Bearer <token>' } // Assuming token-based auth
    })
      .then(response => response.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <div>
      <h1>My Books</h1>
      <ul>
        {books.map(book => (
          <li key={book.book_id}>
            {book.title} by {book.author} (Due: {book.due_date})
          </li>
        ))}
      </ul>
    </div>
  );
}