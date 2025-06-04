// routes/notes.js

import express from 'express';
import pool from '../db.js'; // PostgreSQL connection pool
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, title, content FROM notes WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new note for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a note by ID for the authenticated user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    // Ensure the note belongs to the authenticated user
    const note = await pool.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [noteId, userId]
    );

    if (note.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
