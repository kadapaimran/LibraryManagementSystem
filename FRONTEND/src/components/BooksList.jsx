import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/BooksList.css";

// Debounce hook (to prevent excessive re-renders)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BooksList = () => {
  const [books, setBooks] = useState([]); // Stores all books
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term for title/author
  const [sortBy, setSortBy] = useState("title"); // Sort by title or author

  // Using debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch books from the API when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get("http://localhost:8080/api/books");
        console.log("Books received:", response.data); // Debugging - Log API response
        setBooks(Array.isArray(response.data) ? response.data : []); // Set books data
        setError(""); // Reset error
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBooks();
  }, []); // Only run on component mount

  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      const borrowData = {
        userId: 1, // Hardcoded for now; replace with authenticated user ID
        bookId: bookId,
        borrowDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        returnDate: null,
      };
      await axios.post("http://localhost:8080/api/borrows", borrowData);
      alert("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      setError("Failed to borrow book. Please try again.");
    }
  };

  // Filter books based on debounced search term
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort books based on selected sort option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "author") {
      return a.author.localeCompare(b.author);
    }
    return 0;
  });

  // Handle book image loading errors
  const handleImageError = (e) => {
    e.target.src = "/placeholder-book.jpg"; // Fallback image
  };

  return (
    <div className="books-container">
      <h1 className="page-title">Book Collection</h1>

      {/* Search input */}
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Sort dropdown */}
        <div className="filter-container">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
          </select>
        </div>
      </div>

      {/* Error and loading states */}
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : sortedBooks.length === 0 ? (
        <div className="no-results">No books found matching your criteria.</div>
      ) : (
        <div className="book-gallery">
          {sortedBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover-container">
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  className="book-cover" 
                  onError={handleImageError}
                />
              </div>
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">By {book.author}</p>
                <div className="book-actions">
                  <a 
                    href={book.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="read-button"
                  >
                    Read PDF
                  </a>
                  <button
                    onClick={() => handleBorrow(book.id)}
                    className="borrow-button"
                  >
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;