const express = require('express');
const pool = require('../db');
const validateId = require('../middleware/validateId');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { type, genre_id, year, search } = req.query;

    if (type && !['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'type: movie или series' });
    }
    if (year && isNaN(Number(year))) {
      return res.status(400).json({ error: 'year должен быть числом' });
    }
    if (genre_id && isNaN(Number(genre_id))) {
      return res.status(400).json({ error: 'genre_id должен быть числом' });
    }

    const conditions = [];
    const values = [];

    if (type) {
      values.push(type);
      conditions.push(`t.type = $${values.length}`);
    }
    if (genre_id) {
      values.push(Number(genre_id));
      conditions.push(`t.genre_id = $${values.length}`);
    }
    if (year) {
      values.push(Number(year));
      conditions.push(`t.year = $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`t.title ILIKE $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT t.*, g.name AS genre_name
       FROM titles t
       LEFT JOIN genres g ON g.id = t.genre_id
       ${where}
       ORDER BY t.id`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT t.*, g.name AS genre_name
       FROM titles t
       LEFT JOIN genres g ON g.id = t.genre_id
       WHERE t.id = $1`,
      [req.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;