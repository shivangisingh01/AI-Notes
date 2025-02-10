
// src/components/NoteCard.jsx
import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { BiCopy, BiTrash, BiEdit, BiCheck } from 'react-icons/bi';

function NoteCard({ note, onDelete, onRename, onClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title || 'Untitled');

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.content);
    alert('Note copied to clipboard!');
  };

  const handleRename = (e) => {
    e.stopPropagation();
    if (isEditing) {
      onRename(note._id, newTitle);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="shadow-sm" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body>
        {isEditing ? (
          <Form.Control 
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2"
            onClick={(e) => e.stopPropagation()}  // prevent modal open when editing
          />
        ) : (
          <Card.Title>{note.title || 'Untitled'}</Card.Title>
        )}
        <Card.Text>{note.content}</Card.Text>
        <div className="d-flex justify-content-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline-secondary" size="sm" onClick={handleCopy} title="Copy Note">
            <BiCopy size={18} />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} title="Delete Note">
            <BiTrash size={18} />
          </Button>
          <Button variant="outline-info" size="sm" onClick={handleRename} title="Rename Note">
            {isEditing ? <BiCheck size={18} /> : <BiEdit size={18} />}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NoteCard;


