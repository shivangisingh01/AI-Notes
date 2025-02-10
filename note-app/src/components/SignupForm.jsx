// src/components/SignupForm.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function SignupForm({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onSignup(data.token);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default SignupForm;



