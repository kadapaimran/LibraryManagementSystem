import { useState } from 'react';
import './AddBook.css'

function AddBookForm() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    publishedDate: '',
    imageUrl: '',
    pdfUrl: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      const data = await response.json();
      setMessage(`Book "${data.title}" added successfully!`);
      setBook({
        title: '',
        author: '',
        genre: '',
        publishedDate: '',
        imageUrl: '',
        pdfUrl: '',
      }); // Reset form
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding book');
    }
  };

 return (
  <div className="form-container">
    <h2>Add New Book</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title:</label>
        <input type="text" name="title" value={book.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Author:</label>
        <input type="text" name="author" value={book.author} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Genre:</label>
        <input type="text" name="genre" value={book.genre} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Published Date:</label>
        <input type="date" name="publishedDate" value={book.publishedDate} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Image URL:</label>
        <input type="text" name="imageUrl" value={book.imageUrl} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>PDF URL:</label>
        <input type="text" name="pdfUrl" value={book.pdfUrl} onChange={handleChange} />
      </div>
      <div className="form-group">
  <label>Available Copies</label>
  <input
    type="number"
    value={book.available}
    onChange={(e) => setBook({ ...book, available: parseInt(e.target.value, 10) || 0 })}
    placeholder="Enter number of available copies"
    required
  />
</div>

      <button type="submit">Add Book</button>
    </form>
    {message && <p className="message">{message}</p>}
  </div>
);

}

export default AddBookForm;
