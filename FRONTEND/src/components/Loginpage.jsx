import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Create the request payload
    const loginData = { email, password };
    console.log('Sending:', loginData);

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Response status:', response.status);
      
      // For any non-2xx response, handle as error
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(errorText || 'Login failed: Invalid email or password');
      }
      
      // For successful response
      console.log('Login successful');
      
      // Determine navigation based on email prefix
      if (email.toLowerCase().startsWith('ad')) {
        console.log('Routing to admin page');
        navigate('/librarian');
      } else {
        console.log('Routing to user page');
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="login-page">
      <div className="glass-overlay"></div>
      <div className="login-content">
        <h1>Login</h1>
        {error && <p id="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-links">
          <p>
            Dont have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;