import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Notes = ({ onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <Form.Control
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      {filteredNotes.map((note) => (
        <Card key={note._id} className="mb-3">
          <Card.Body>
            <Card.Title>{note.title}</Card.Title>
            <Card.Text>{note.content}</Card.Text>
            <Button variant="danger" size="sm" className="me-2">
              Delete
            </Button>
            <Button variant="secondary" size="sm">
              Rename
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Notes;