import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    quantity: 1,
    pdfUrl: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/bo", book)
      .then(() => {
        alert("Book added successfully!");
        navigate("/librarian"); // Redirect to librarian page after adding book
      })
      .catch(error => console.error("Error adding book:", error));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} required /><br />
        <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} required /><br />
        <input type="text" name="genre" placeholder="Genre" value={book.genre} onChange={handleChange} required /><br />
        <input type="number" name="quantity" placeholder="Quantity" value={book.quantity} onChange={handleChange} min="1" required /><br />
        <input type="text" name="imageUrl" placeholder="Image URL" value={book.imageUrl} onChange={handleChange} required /><br />
        <input type="text" name="pdfUrl" placeholder="PDF URL" value={book.pdfUrl} onChange={handleChange} required /><br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
