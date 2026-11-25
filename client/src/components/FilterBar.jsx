import { useEffect, useState } from 'react';
import { getGenres } from '../api';

export default function FilterBar({ filters, onChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters">
      <select value={filters.type} onChange={(e) => set('type', e.target.value)}>
        <option value="">Все типы</option>
        <option value="movie">Фильм</option>
        <option value="series">Сериал</option>
      </select>

      <select value={filters.genre_id} onChange={(e) => set('genre_id', e.target.value)}>
        <option value="">Все жанры</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Год"
        value={filters.year}
        onChange={(e) => set('year', e.target.value)}
      />

      <input
        type="text"
        placeholder="Поиск"
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
      />
    </div>
  );
}