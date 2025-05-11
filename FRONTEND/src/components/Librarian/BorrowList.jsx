import { useEffect, useState } from "react";
import axios from "axios";
import "./Borrow.css";

const AdminBorrowList = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch borrow records from the API
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/borrows");
        setBorrows(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (error) {
        console.error("Error fetching borrows:", error);
        setError("Failed to load borrow records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  return (
    <div className="borrows-container">
      <h1 className="page-title">Borrow Records</h1>

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading borrow records...</p>
        </div>
      ) : borrows.length === 0 ? (
        <div className="no-results">No borrow records found.</div>
      ) : (
        <table className="borrows-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map(borrow => (
              <tr key={borrow.id}>
                <td>{borrow.user.name}</td>
                <td>{borrow.book.title}</td>
                <td>{borrow.borrowDate}</td>
                <td>{borrow.returnDate || "Not Returned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBorrowList;