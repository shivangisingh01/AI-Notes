
// src/components/MainPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ListGroup,
} from 'react-bootstrap';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import { BiHome, BiStar, BiSortAlt2 } from 'react-icons/bi';
import { FaLightbulb, FaUserCircle } from 'react-icons/fa';

function MainPage({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [showProfileLogout, setShowProfileLogout] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const recognitionRef = useRef(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes', err);
      setError('Error fetching notes');
    }
  };

  // Create a new note (text or transcribed voice)
  const handleCreateNote = async () => {
    if (!newNoteText.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNoteText }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([...notes, data]);
        setNewNoteText('');
      } else {
        setError(data.message || 'Error creating note');
      }
    } catch (err) {
      console.error('Error creating note', err);
      setError('Error creating note');
    }
  };

  // Delete note handler
  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      }
    } catch (err) {
      console.error('Error deleting note', err);
      setError('Error deleting note');
    }
  };

  // Rename note handler
  const handleRenameNote = async (id, newTitle) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      const updatedNote = await res.json();
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
    } catch (err) {
      console.error('Error renaming note', err);
      setError('Error renaming note');
    }
  };

  // Voice recording functionality using the Web Speech API
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewNoteText((prev) => prev + ' ' + transcript);
    };
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event);
    };
    recognitionRef.current.start();
    setIsRecording(true);
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 60000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Filter notes based on search query (by title and content)
  const filteredNotes = notes.filter((note) => {
    const content = note.content ? note.content.toLowerCase() : '';
    const title = note.title ? note.title.toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return content.includes(query) || title.includes(query);
  });

  // Sort filtered notes by creation date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return sortAsc
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  // Open the modal with the selected note
  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  // Callback when modal saves changes
  const handleModalSave = (updatedNote) => {
    setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
    setSelectedNote(updatedNote);
  };

  // Toggle favorite status from modal
  const handleFavoriteToggle = (note) => {
    const updatedNote = { ...note, favorite: !note.favorite };
    setNotes(notes.map((n) => (n._id === note._id ? updatedNote : n)));
    setSelectedNote(updatedNote);
  };

  return (
    <Container fluid className="p-0">
      <Row className="vh-100 no-gutters">
        {/* Sidebar */}
        <Col
          md={3}
          className="bg-light border-end d-flex flex-column"
          style={{ minHeight: '100vh' }}
        >
          {/* Sidebar Header */}
          <div className="p-4 d-flex align-items-center">
            <FaLightbulb size={28} className="me-2 text-primary" />
            <h4 className="mb-0">AI Notes</h4>
          </div>
          {/* Navigation Items */}
          <ListGroup variant="flush" className="flex-grow-1">
            <ListGroup.Item action className="d-flex align-items-center">
              <BiHome size={20} className="me-2" /> Home
            </ListGroup.Item>
            <ListGroup.Item action className="d-flex align-items-center">
              <BiStar size={20} className="me-2" /> Favourites
            </ListGroup.Item>
          </ListGroup>
          {/* Sidebar Footer with Profile and Logout */}
          <div className="p-3 border-top">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowProfileLogout(!showProfileLogout)}
            >
              <div className="d-flex align-items-center">
                <FaUserCircle size={28} className="me-2" />
                <span>John Doe</span>
              </div>
            </div>
            {showProfileLogout && (
              <div className="mt-2">
                <Button variant="outline-danger" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Col>
        {/* Main Content */}
        <Col className="d-flex flex-column" md={9}>
          {/* Header with stretched search bar and sort button */}
          <div className="p-4 border-bottom d-flex align-items-center">
            <Form className="flex-grow-1 me-2">
              <Form.Control
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form>
            <Button variant="outline-secondary" onClick={toggleSortOrder} title="Sort Notes">
              <BiSortAlt2 size={20} />
            </Button>
          </div>
          {error && <Alert variant="danger" className="m-4">{error}</Alert>}
          {/* Notes List */}
          <div className="p-4 flex-grow-1 overflow-auto">
            <Row>
              {sortedNotes.map((note) => (
                <Col key={note._id} xs={12} md={6} lg={4} className="mb-3">
                  <NoteCard
                    note={note}
                    onDelete={handleDeleteNote}
                    onRename={handleRenameNote}
                    onClick={() => handleNoteClick(note)}
                  />
                </Col>
              ))}
            </Row>
          </div>
          {/* Note Creation Section fixed to the bottom */}
          <div className="p-3 border-top bg-white">
            <Form.Group controlId="newNoteText" className="mb-3">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Type your note here..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              {!isRecording ? (
                <Button variant="success" onClick={startRecording} className="me-2">
                  Start Recording
                </Button>
              ) : (
                <Button variant="warning" onClick={stopRecording} className="me-2">
                  Stop Recording
                </Button>
              )}
              <Button variant="primary" onClick={handleCreateNote}>
                Add Note
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      {/* Note Modal */}
      {selectedNote && (
        <NoteModal
          show={showModal}
          onHide={() => setShowModal(false)}
          note={selectedNote}
          onSave={handleModalSave}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </Container>
  );
}

export default MainPage;




