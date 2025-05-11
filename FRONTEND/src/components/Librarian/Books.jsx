import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Books.css";

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
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [borrowingBook, setBorrowingBook] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Using debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch books from the API when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/books");
        setBooks(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 5000);
  };

  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      setBorrowingBook(bookId);
      const borrowData = {
        userId: 1, // Hardcoded for now; replace with authenticated user ID
        bookId: bookId,
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: null,
      };
      await axios.post("http://localhost:8080/api/borrows", borrowData);
      
      // Update the local state to reflect the borrowed book
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId ? { ...book, isBorrowed: true } : book
        )
      );
      
      // Show success notification
      addNotification("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      addNotification("Failed to borrow book. Please try again.", "error");
    } finally {
      setBorrowingBook(null);
    }
  };

  // Filter and sort books using useMemo for performance
  const processedBooks = useMemo(() => {
    // Filter books
    const filtered = books.filter(book => {
      return book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
             book.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });
    
    // Sort books
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "author") {
        comparison = a.author.localeCompare(b.author);
      } else if (sortBy === "genre") {
        comparison = (a.genre || "").localeCompare(b.genre || "");
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [books, debouncedSearchTerm, sortBy, sortOrder]);

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = processedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(processedBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
  };

  // Handle book image loading errors
  const handleImageError = (e) => {
    e.target.src = "/placeholder-book.jpg"; // Fallback image
  };

  // Reset search and filters
  const handleReset = () => {
    setSearchTerm("");
    setSortBy("title");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <div className="books-container">
      <h1 className="page-title">Book Collection</h1>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(note => (
          <div 
            key={note.id} 
            className={`notification ${note.type}`}
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== note.id))}
          >
            {note.message}
          </div>
        ))}
      </div>

      {/* Search and filter controls */}
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="search-input"
            aria-label="Search books"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-container">
          <select 
            value={sortBy} 
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="sort-select"
            aria-label="Sort by"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="genre">Sort by Genre</option>
          </select>
          
          <button 
            className="sort-direction" 
            onClick={toggleSortOrder}
            aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          
          {(searchTerm || sortBy !== "title" || sortOrder !== "asc") && (
            <button 
              className="reset-filters"
              onClick={handleReset}
              aria-label="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && <div className="error-message" role="alert">{error}</div>}
      
      {/* Loading state */}
      {loading ? (
        <div className="loading-container" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading books...</p>
        </div>
      ) : processedBooks.length === 0 ? (
        <div className="no-results" role="status">
          No books found matching your criteria.
          {searchTerm && <button onClick={() => setSearchTerm("")} className="clear-search-button">Clear Search</button>}
        </div>
      ) : (
        <>
          {/* Book count summary */}
          <div className="results-summary">
            Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, processedBooks.length)} of {processedBooks.length} books
          </div>
          
          {/* Books table */}
          <div className="books-table-container">
            <table className="books-table" aria-label="Books list">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map(book => (
                  <tr key={book.id}>
                    <td className="book-cover">
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={`Cover of ${book.title}`} 
                          onError={handleImageError}
                          loading="lazy"
                          width="60"
                          height="90"
                        />
                      ) : (
                        <div className="placeholder-cover">{book.title.charAt(0)}</div>
                      )}
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleBorrow(book.id)}
                        className={`borrow-button ${book.isBorrowed ? "borrowed" : ""}`}
                        disabled={borrowingBook === book.id || book.isBorrowed}
                      >
                        {borrowingBook === book.id ? (
                          <span className="button-spinner"></span>
                        ) : book.isBorrowed ? (
                          "Borrowed"
                        ) : (
                          "Borrow"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-button"
                aria-label="Previous page"
              >
                &laquo;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => {
                // Show first page, last page, current page, and adjacent pages
                const pageNum = i + 1;
                if (
                  pageNum === 1 || 
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`page-button ${currentPage === pageNum ? "active" : ""}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) ||
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNum} className="ellipsis">...</span>;
                }
                return null;
              })}
              
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-button"
                aria-label="Next page"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BooksList;