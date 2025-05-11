import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';

// Debounce hook
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

const TopNavbar = () => (
  <nav className="top-navbar">
    <div className="nav-links">
      <Link to="/user" className="nav-link active">Home</Link>
      <Link to="/book_list" className="nav-link">Browse Books</Link>
      <Link to="/user_dashboard" className="nav-link">My Books</Link>
      <Link to="/borrowing_history" className="nav-link">History</Link>
    </div>
    <div className="user-actions">
      <Link to="/profile" className="user-action-link">Profile</Link>
      <Link to="/logout" className="user-action-link">Logout</Link>
    </div>
  </nav>
);

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="search-bar">
    <div className="search-container">
      <input
        type="search"
        placeholder="Search books, authors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  </div>
);

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/books');
        setBooks(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const recommendedBooks = filteredBooks.slice(0, 4);

  const handleImageError = (e) => {
    e.target.src = '/placeholder-book.jpg'; // Default placeholder image
  };

  return (
    <div className="app-container light-brown-theme">
      <TopNavbar />
      <main className="main-content">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="content-container">
          <h2 className="page-title">Welcome to the Library Dashboard</h2>

          {error && <div className="error-message">{error}</div>}

          <h3 className="section-title">Recommended Books</h3>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading books...</p>
            </div>
          ) : recommendedBooks.length === 0 ? (
            <div className="no-results">No recommended books found.</div>
          ) : (
            <div className="book-gallery">
              {recommendedBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover-container">
                    <img
                      src={book.imageUrl || '/placeholder-book.jpg'} // Fallback to a placeholder if image URL is missing
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
                        href={book.pdfUrl || '#'} // Fallback to a placeholder URL
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-button"
                      >
                        Read PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="section-title">All Books</h3>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="no-results">No books found.</div>
          ) : (
            <div className="book-gallery">
              {filteredBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover-container">
                    <img
                      src={book.imageUrl || '/placeholder-book.jpg'} // Fallback to a placeholder if image URL is missing
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
                        href={book.pdfUrl || '#'} // Fallback to a placeholder URL
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-button"
                      >
                        Read PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
