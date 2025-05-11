import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [processingUser, setProcessingUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/users");
        setUsers(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      setProcessingUser(userId);
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      
      // Update local state to remove the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setShowDeleteModal(false);
      setSelectedUser(null);
      
      // Show success notification
      addNotification("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      addNotification("Failed to delete user. Please try again.", "error");
    } finally {
      setProcessingUser(null);
    }
  };

  // Handle viewing user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    // This could open a modal or redirect to a user details page
    // For now, just show a notification
    addNotification(`Viewing user: ${user.name}`);
  };

  // Filter and sort users using useMemo for performance
  const processedUsers = useMemo(() => {
    // Filter users based on search term
    const filtered = users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower))
      );
    });
    
    // Sort users
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "id") {
        comparison = a.id - b.id;
      } else if (sortBy === "name") {
        comparison = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "email") {
        comparison = (a.email || "").localeCompare(b.email || "");
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [users, searchTerm, sortBy, sortOrder]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = processedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <div className="user-list-container">
      <h1 className="page-title">User Management</h1>

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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
            aria-label="Search users"
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
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
          
          <button 
            className="sort-direction" 
            onClick={toggleSortOrder}
            aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          
          {(searchTerm || sortBy !== "name" || sortOrder !== "asc") && (
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
          <p>Loading users...</p>
        </div>
      ) : processedUsers.length === 0 ? (
        <div className="no-results" role="status">
          No users found matching your criteria.
          {searchTerm && <button onClick={() => setSearchTerm("")} className="clear-search-button">Clear Search</button>}
        </div>
      ) : (
        <>
          {/* User count summary */}
          <div className="results-summary">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, processedUsers.length)} of {processedUsers.length} users
          </div>
          
          {/* Users table */}
          <div className="users-table-container">
            <table className="users-table" aria-label="Users list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "Member"}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="view-button"
                        aria-label={`View details for ${user.name}`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="delete-button"
                        disabled={processingUser === user.id}
                        aria-label={`Delete ${user.name}`}
                      >
                        {processingUser === user.id ? (
                          <span className="button-spinner"></span>
                        ) : (
                          "Delete"
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

      {/* Delete confirmation modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-labelledby="delete-modal-title">
            <h2 id="delete-modal-title">Confirm Deletion</h2>
            <p>Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button"
                onClick={() => handleDeleteUser(selectedUser.id)}
                disabled={processingUser === selectedUser.id}
              >
                {processingUser === selectedUser.id ? (
                  <span className="button-spinner"></span>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;