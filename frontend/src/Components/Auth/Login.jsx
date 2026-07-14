// src/components/Auth/Login.jsx
import { useState } from 'react';
import { LogIn, User, ShieldCheck } from 'lucide-react';

export function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        // Pass user to App.jsx
        onAuthSuccess(data);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Server connection error. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-1">CampusStay</h2>
            <p className="text-muted">Hostel Management System</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">I am a</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-grow-1 btn ${role === 'student' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  <User size={18} className="me-2" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-grow-1 btn ${role === 'admin' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  <ShieldCheck size={18} className="me-2" /> Admin
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-medium"
              disabled={loading}
            >
              {loading ? 'Signing in...' : (
                <>
                  <LogIn size={18} className="me-2" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => (window.location.hash = 'signup')}
              className="text-decoration-none text-primary fw-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}