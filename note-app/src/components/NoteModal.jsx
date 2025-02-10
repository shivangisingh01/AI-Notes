// src/components/NoteModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import {
  MdFullscreen,
  MdFullscreenExit,
  MdFavorite,
  MdFavoriteBorder,
  MdEdit,
} from 'react-icons/md';

const NoteModal = ({ show, onHide, note, onSave, onFavoriteToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note?.title || '');
  const [editedContent, setEditedContent] = useState(note?.content || '');
  const [uploadedImage, setUploadedImage] = useState(note?.image || null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update local state when the note prop changes
  useEffect(() => {
    setEditedTitle(note?.title || '');
    setEditedContent(note?.content || '');
    setUploadedImage(note?.image || null);
  }, [note]);

  // Save changes and call onSave callback
  const handleSave = () => {
    const updatedNote = {
      ...note,
      title: editedTitle,
      content: editedContent,
      image: uploadedImage,
    };
    onSave(updatedNote);
    setIsEditing(false);
  };

  // Toggle fullscreen mode for the modal
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle image upload event
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demonstration, create a temporary local URL.
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName={isFullscreen ? 'modal-fullscreen' : ''}
      size={isFullscreen ? 'xl' : 'lg'}
      centered
    >
      <Modal.Header closeButton>
        {isEditing ? (
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
          />
        ) : (
          <Modal.Title>{note?.title || 'Untitled Note'}</Modal.Title>
        )}
        <Button variant="link" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
        </Button>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <Form.Control
            as="textarea"
            rows={5}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Note content..."
          />
        ) : (
          <div>{note?.content}</div>
        )}
        {/* If the note has an audio transcription, display it */}
        {note?.audio && (
          <div className="mt-3">
            <strong>Transcription:</strong>
            <div>{note.audio}</div>
          </div>
        )}
        {/* Display uploaded image, if any */}
        {uploadedImage && (
          <div className="mt-3">
            <Image src={uploadedImage} fluid alt="Uploaded" />
          </div>
        )}
        <div className="mt-3">
          <Form.Label className="d-block">Upload Image:</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="link" onClick={() => setIsEditing(true)} title="Edit Note">
              <MdEdit size={20} /> Edit
            </Button>
            <Button variant="link" onClick={() => onFavoriteToggle(note)} title="Favorite Note">
              {note?.favorite ? (
                <MdFavorite size={20} color="red" />
              ) : (
                <MdFavoriteBorder size={20} />
              )}{' '}
              Favorite
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NoteModal;
