import  { useState, useEffect } from 'react';
import './ProfilePage.css'; // Optional: Add your own CSS for styling

const ProfilePage = () => {
  // State to manage form fields and messages
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user details when the page loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const user = await response.json();
        setUsername(user.username);
        setEmail(user.email);
        // Password is not fetched for security reasons
      } catch (err) {
        setError('An error occurred while fetching user details.');
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array means this runs once on mount

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
    setSuccess(''); // Clear previous success

    // Basic validation
    if (!username || !email) {
      setError('Username and email are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Prepare data to send to the backend
      const updateData = { username, email };
      if (password) {
        updateData.password = password; // Only include password if provided
      }

      const response = await fetch('http://localhost:8080/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Update failed');
        return;
      }

      setSuccess('Profile updated successfully');
      // Clear password fields after successful update
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      
      {/* Display error or success messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Form for editing user details */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>

      {/* Optional link to go back */}
      <p><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  );
};

export default ProfilePage;