import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import SignupPage from './components/Signup'; 
import Home from './components/Home';
import Librarian from './components/Librarian/Librarian';
import User from './components/User/User';
import ManageBooks from './components/Librarian/Books'; // Import ManageBooks
import BooksList from './components/BooksList';
import Users from './components/Librarian/UserList'

import LibraryReports from './components/Librarian/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user" element={<User />} />
        <Route path="/librarian" element={<Librarian />} />
        <Route path="/manage_books" element={<ManageBooks />} /> {/* Added Book Management */}
        <Route path="/logout" element={<LoginPage />} />
        <Route path="/book_list" element={<BooksList />} /> {/* Added Book Management */}
        <Route path="/librarian/books" element={<ManageBooks />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/reports" element={<LibraryReports />} />
        
      </Routes>
    </Router>
  );
}

export default App;
