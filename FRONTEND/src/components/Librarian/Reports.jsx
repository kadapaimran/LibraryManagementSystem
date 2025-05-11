import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Reports.css";

// Chart components
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const LibraryReports = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [exportLoading, setExportLoading] = useState(false);

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
        setError("Failed to load books data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // For demo purposes, let's create some simulated borrow data
  const borrowData = useMemo(() => {
    if (!books.length) return [];
    
    // Create random borrow data for demo
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Create more realistic data with seasonal patterns
      const seasonalFactor = Math.sin((index / 12) * Math.PI * 2) * 5 + 5;
      const trendFactor = index * 0.5; // Slight upward trend
      
      // Calculate borrowed and returned
      const borrowed = Math.floor(15 + seasonalFactor + trendFactor + Math.random() * 10);
      const returned = Math.floor(borrowed * (0.7 + Math.random() * 0.2)); // 70-90% return rate
      
      return {
        name: month,
        borrowed: borrowed,
        returned: returned,
        active: borrowed - returned,
        isCurrentMonth: index === currentMonth
      };
    });
  }, [books]);

  // Calculate genre distribution
  const genreData = useMemo(() => {
    if (!books.length) return [];
    
    const genreCounts = books.reduce((acc, book) => {
      const genre = book.genre || "Uncategorized";
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array and sort by count
    return Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [books]);

  // Calculate book availability status
  const availabilityData = useMemo(() => {
    if (!books.length) return [];
    
    const available = books.filter(book => !book.isBorrowed).length;
    const borrowed = books.length - available;
    
    return [
      { name: "Available", value: available },
      { name: "Borrowed", value: borrowed }
    ];
  }, [books]);

  // Calculate popular authors
  const authorData = useMemo(() => {
    if (!books.length) return [];
    
    const authorCounts = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array, sort by count, and take top 5
    return Object.entries(authorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [books]);

  // Generate CSV data for export
  const generateCSV = (data, headers) => {
    const headerRow = headers.join(',');
    const dataRows = data.map(row => 
      headers.map(header => row[header] !== undefined ? row[header] : '').join(',')
    );
    return [headerRow, ...dataRows].join('\n');
  };

  // Handle export to CSV
  const handleExport = (reportType) => {
    setExportLoading(true);
    
    let csvData;
    let filename;
    
    switch (reportType) {
      case 'books':
        csvData = generateCSV(books, ['id', 'title', 'author', 'genre', 'isBorrowed']);
        filename = 'library_books_report.csv';
        break;
      case 'genres':
        csvData = generateCSV(genreData, ['name', 'value']);
        filename = 'library_genres_report.csv';
        break;
      case 'activity':
        csvData = generateCSV(borrowData, ['name', 'borrowed', 'returned', 'active']);
        filename = 'library_activity_report.csv';
        break;
      default:
        csvData = generateCSV(books, ['id', 'title', 'author', 'genre', 'isBorrowed']);
        filename = 'library_report.csv';
    }
    
    // Create and download the CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportLoading(false);
  };

  // ChartColorPalette
  const COLORS = ['#2c3e50', '#3498db', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400'];

  // Format data for printing when needed
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-container" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-message" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Library Reports Dashboard</h1>
        <p className="last-updated">Data as of {formatDate()}</p>
      </div>

      <div className="reports-tabs">
        <button 
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === "genres" ? "active" : ""}`}
          onClick={() => setActiveTab("genres")}
        >
          Genres
        </button>
        <button 
          className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button 
          className={`tab-button ${activeTab === "authors" ? "active" : ""}`}
          onClick={() => setActiveTab("authors")}
        >
          Popular Authors
        </button>
      </div>

      <div className="reports-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Books</h3>
                <div className="card-value">{books.length}</div>
              </div>
              <div className="summary-card">
                <h3>Available Books</h3>
                <div className="card-value">{books.filter(book => !book.isBorrowed).length}</div>
              </div>
              <div className="summary-card">
                <h3>Borrowed Books</h3>
                <div className="card-value">{books.filter(book => book.isBorrowed).length}</div>
              </div>
              <div className="summary-card">
                <h3>Total Genres</h3>
                <div className="card-value">{genreData.length}</div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-container half-width">
                <h3>Book Availability</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={availabilityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {availabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Books']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="chart-container half-width">
                <h3>Top 5 Genres</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Books']} />
                    <Bar dataKey="value" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="actions-container">
              <button 
                className="export-button"
                onClick={() => handleExport('books')}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Books Report'}
              </button>
              <button className="print-button" onClick={() => window.print()}>Print Report</button>
            </div>
          </div>
        )}

        {activeTab === "genres" && (
          <div className="genres-tab">
            <h2>Book Genre Distribution</h2>
            
            <div className="chart-row">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={genreData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 100,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Books']} />
                    <Bar dataKey="value" fill="#3498db">
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="genre-stats">
              <h3>Genre Statistics</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Genre</th>
                    <th>Number of Books</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {genreData.map((genre) => (
                    <tr key={genre.name}>
                      <td>{genre.name}</td>
                      <td>{genre.value}</td>
                      <td>{((genre.value / books.length) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="actions-container">
              <button 
                className="export-button"
                onClick={() => handleExport('genres')}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Genre Report'}
              </button>
              <button className="print-button" onClick={() => window.print()}>Print Report</button>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-tab">
            <div className="date-filter">
              <label>Time Period:</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <div className="chart-container">
              <h3>Library Activity</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={borrowData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="borrowed" 
                    stroke="#3498db" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="returned" 
                    stroke="#e74c3c" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#27ae60" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="activity-summary">
              <h3>Activity Analysis</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <h4>Most Active Month</h4>
                  <div className="card-value">
                    {borrowData.reduce((max, month) => 
                      month.borrowed > max.borrowed ? month : max, borrowData[0]).name}
                  </div>
                </div>
                <div className="summary-card">
                  <h4>Total Borrowed</h4>
                  <div className="card-value">
                    {borrowData.reduce((sum, month) => sum + month.borrowed, 0)}
                  </div>
                </div>
                <div className="summary-card">
                  <h4>Total Returned</h4>
                  <div className="card-value">
                    {borrowData.reduce((sum, month) => sum + month.returned, 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-container">
              <button 
                className="export-button"
                onClick={() => handleExport('activity')}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Activity Report'}
              </button>
              <button className="print-button" onClick={() => window.print()}>Print Report</button>
            </div>
          </div>
        )}

        {activeTab === "authors" && (
          <div className="authors-tab">
            <h2>Popular Authors</h2>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={authorData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Books']} />
                  <Bar dataKey="count" fill="#8e44ad">
                    {authorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="author-books">
              <h3>Books by Author</h3>
              {authorData.map((author) => (
                <div key={author.name} className="author-section">
                  <h4>{author.name} ({author.count} books)</h4>
                  <ul className="book-list">
                    {books
                      .filter(book => book.author === author.name)
                      .map(book => (
                        <li key={book.id}>
                          {book.title} 
                          {book.genre && <span className="book-genre"> - {book.genre}</span>}
                          {book.isBorrowed && <span className="borrowed-badge">Borrowed</span>}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryReports;