import { Link } from 'react-router-dom';
import './Librarian.css'; // Ensure correct path to your styles
import AddBookForm from './AddBook';

// Navbar Component (converted from Sidebar)
const Navbar = () => (
  <header className="main-navbar">
    <div className="navbar-brand">
      <h2>📖 Library System</h2>
    </div>
    <nav className="navbar-nav">
      <Link to="/librarian">📊 Dashboard</Link>
      <Link to="/reports">📜 Reports</Link>
      <Link to="/manage_books">📚 Manage Books</Link>
      <Link to="/admin/users">👥 Users</Link>
      <Link to="/settings">⚙️ Settings</Link>
    </nav>
    <div className="navbar-user-actions">
      <div className="search-container">
        <input type="search" placeholder="🔍 Search books, authors..." />
      </div>
      <Link to="/user_profile" className="user-action-link">👤 Profile</Link>
      <Link to="/logout" className="user-action-link logout">🚪 Logout</Link>
    </div>
  </header>
);

// Dashboard Component
const Dashboard = () => (
  <div>
    <div className="dashboard">
      <h2>📚 Librarian Dashboard</h2>
      <p>Manage books, users, and reports efficiently.</p>
    </div>
    <div>
      <RecentActivity />
    </div>
  </div>
);

// Recent Activity Component
const RecentActivity = () => (
  
    <AddBookForm/>
  
);

// Main Librarian Page
const Librarian = () => (
  <div className="app-container">
    <Navbar />
    <main className="main-content">
      <Dashboard />
    </main>
  </div>
);

export default Librarian;