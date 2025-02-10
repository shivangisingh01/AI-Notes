// src/App.js
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import MainPage from './components/MainPage';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            {showLogin ? (
              <>
                <LoginForm onLogin={handleLogin} />
                <div className="text-center mt-3">
                  <span>Don't have an account? </span>
                  <button className="btn btn-link" onClick={() => setShowLogin(false)}>
                    Sign Up
                  </button>
                </div>
              </>
            ) : (
              <>
                <SignupForm onSignup={handleLogin} />
                <div className="text-center mt-3">
                  <span>Already have an account? </span>
                  <button className="btn btn-link" onClick={() => setShowLogin(true)}>
                    Login
                  </button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

  return <MainPage token={token} onLogout={handleLogout} />;
}

export default App;

