const express = require('express');
const pool = require('../db');
const validateId = require('../middleware/validateId');

const router = express.Router({ mergeParams: true });

router.get('/', validateId, async (req, res, next) => {
  try {
    const title = await pool.query('SELECT id, type FROM titles WHERE id = $1', [req.id]);
    if (title.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    if (title.rows[0].type !== 'series') {
      return res.status(400).json({ error: 'У фильма нет эпизодов' });
    }

    const result = await pool.query(
      'SELECT * FROM episodes WHERE title_id = $1 ORDER BY season, episode',
      [req.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateId, async (req, res, next) => {
  try {
    const { season, episode, name } = req.body;

    if (!Number.isInteger(season) || season <= 0) {
      return res.status(400).json({ error: 'season: положительное целое число' });
    }
    if (!Number.isInteger(episode) || episode <= 0) {
      return res.status(400).json({ error: 'episode: положительное целое число' });
    }

    const title = await pool.query('SELECT id, type FROM titles WHERE id = $1', [req.id]);
    if (title.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    if (title.rows[0].type !== 'series') {
      return res.status(400).json({ error: 'Эпизоды можно добавлять только сериалам' });
    }

    const dup = await pool.query(
      'SELECT id FROM episodes WHERE title_id = $1 AND season = $2 AND episode = $3',
      [req.id, season, episode]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({ error: 'Такой эпизод уже существует' });
    }

    const result = await pool.query(
      `INSERT INTO episodes (title_id, season, episode, name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.id, season, episode, name ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;