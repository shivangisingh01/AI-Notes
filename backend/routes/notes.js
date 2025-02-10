// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Note = require('../models/Note');

// GET all notes for the authenticated user, sorted from oldest to newest
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).sort({ createdAt: 1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new note (using provided text, with title auto‑generated if not provided)
router.post('/', authMiddleware, async (req, res) => {
  const { content, title } = req.body;
  try {
    const note = new Note({
      user: req.user.userId,
      content,
      title: title || (content.substring(0, 20) || 'Untitled'),
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note (for renaming or editing content)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
