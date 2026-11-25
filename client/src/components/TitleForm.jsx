import { useEffect, useState } from 'react';
import { getGenres } from '../api';

const empty = { title: '', type: 'movie', year: '', rating: '', genre_id: '' };

export default function TitleForm({ editing, onSubmit, onCancel, error }) {
  const [genres, setGenres] = useState([]);
  
  const [form, setForm] = useState(() => {
    if (editing) {
      return {
        title: editing.title,
        type: editing.type,
        year: editing.year,
        rating: editing.rating ?? '',
        genre_id: editing.genre_id ?? '',
      };
    }
    return empty;
  });

  useEffect(() => {
    let isMounted = true;
    getGenres().then((data) => {
      if (isMounted) setGenres(data);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const set = (key, value) => setForm({ ...form, [key]: value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      type: form.type,
      year: Number(form.year),
      rating: form.rating === '' ? null : Number(form.rating),
      genre_id: form.genre_id === '' ? null : Number(form.genre_id),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>{editing ? 'Редактировать' : 'Добавить'}</h2>

      <input placeholder="Название" value={form.title} onChange={(e) => set('title', e.target.value)} />
      <select value={form.type} onChange={(e) => set('type', e.target.value)}>
        <option value="movie">Фильм</option>
        <option value="series">Сериал</option>
      </select>
      <input type="number" placeholder="Год" value={form.year} onChange={(e) => set('year', e.target.value)} />
      <input type="number" step="0.1" placeholder="Рейтинг" value={form.rating} onChange={(e) => set('rating', e.target.value)} />
      <select value={form.genre_id} onChange={(e) => set('genre_id', e.target.value)}>
        <option value="">Без жанра</option>
        {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      {error && <div className="error">{error}</div>}

      <div className="actions">
        <button type="submit">{editing ? 'Сохранить' : 'Добавить'}</button>
        {editing && <button type="button" onClick={onCancel}>Отмена</button>}
      </div>
    </form>
  );
}