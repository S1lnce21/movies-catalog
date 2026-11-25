const express = require('express');
const cors = require('cors');
const titlesRouter = require('./routes/titles');
require('dotenv').config();

const genresRouter = require('./routes/genres');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/genres', genresRouter);
app.use('/titles', titlesRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));