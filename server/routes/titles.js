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

router.post('/', async (req, res, next) => {
  try {
    const { title, type, year, rating, genre_id } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Поле title обязательно' });
    }
    if (!['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'type: movie или series' });
    }
    if (!Number.isInteger(year) || year < 1888 || year > 2100) {
      return res.status(400).json({ error: 'year: целое число от 1888 до 2100' });
    }
    if (rating !== undefined && rating !== null) {
      const r = Number(rating);
      if (isNaN(r) || r < 0 || r > 10) {
        return res.status(400).json({ error: 'rating: от 0 до 10' });
      }
    }
    if (genre_id !== undefined && genre_id !== null) {
      const g = await pool.query('SELECT id FROM genres WHERE id = $1', [genre_id]);
      if (g.rows.length === 0) {
        return res.status(404).json({ error: 'Жанр не найден' });
      }
    }

    const result = await pool.query(
      `INSERT INTO titles (title, type, year, rating, genre_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title.trim(), type, year, rating ?? null, genre_id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateId, async (req, res, next) => {
  try {
    const { title, type, year, rating, genre_id } = req.body;

    if (!title || !type || !Number.isInteger(year)) {
      return res.status(400).json({ error: 'title, type, year обязательны' });
    }
    if (!['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'type: movie или series' });
    }
    if (year < 1888 || year > 2100) {
      return res.status(400).json({ error: 'year вне допустимого диапазона' });
    }
    if (rating !== undefined && rating !== null) {
      const r = Number(rating);
      if (isNaN(r) || r < 0 || r > 10) {
        return res.status(400).json({ error: 'rating: от 0 до 10' });
      }
    }

    const exists = await pool.query('SELECT id FROM titles WHERE id = $1', [req.id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    if (genre_id !== undefined && genre_id !== null) {
      const g = await pool.query('SELECT id FROM genres WHERE id = $1', [genre_id]);
      if (g.rows.length === 0) {
        return res.status(404).json({ error: 'Жанр не найден' });
      }
    }

    const result = await pool.query(
      `UPDATE titles
       SET title = $1, type = $2, year = $3, rating = $4, genre_id = $5
       WHERE id = $6 RETURNING *`,
      [title, type, year, rating ?? null, genre_id ?? null, req.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validateId, async (req, res, next) => {
  try {
    const fields = req.body;
    const allowed = ['title', 'type', 'year', 'rating', 'genre_id'];
    const keys = Object.keys(fields);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'Тело запроса не может быть пустым' });
    }
    for (const key of keys) {
      if (!allowed.includes(key)) {
        return res.status(400).json({ error: `Поле ${key} нельзя обновлять` });
      }
    }
    if (fields.type && !['movie', 'series'].includes(fields.type)) {
      return res.status(400).json({ error: 'type: movie или series' });
    }
    if (fields.year !== undefined && (!Number.isInteger(fields.year) || fields.year < 1888 || fields.year > 2100)) {
      return res.status(400).json({ error: 'year вне диапазона' });
    }
    if (fields.rating !== undefined && fields.rating !== null) {
      const r = Number(fields.rating);
      if (isNaN(r) || r < 0 || r > 10) {
        return res.status(400).json({ error: 'rating: от 0 до 10' });
      }
    }

    const exists = await pool.query('SELECT id FROM titles WHERE id = $1', [req.id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    const setParts = [];
    const values = [];
    for (const key of keys) {
      values.push(fields[key]);
      setParts.push(`${key} = $${values.length}`);
    }
    values.push(req.id);

    const result = await pool.query(
      `UPDATE titles SET ${setParts.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM titles WHERE id = $1 RETURNING id', [req.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;