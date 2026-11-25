import { useEffect, useState } from 'react';
import FilterBar from './components/FilterBar';
import TitleCard from './components/TitleCard';
import TitleForm from './components/TitleForm';
import { getTitles, createTitle, updateTitle, deleteTitle } from './api';

export default function App() {
  const [filters, setFilters] = useState({ type: '', genre_id: '', year: '', search: '' });
  const [titles, setTitles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const params = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== '' && v !== null && v !== undefined) params[k] = v;
    }
    getTitles(params).then(setTitles).catch(() => setTitles([]));
  }, [filters]);

  const refreshList = () => {
    const params = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== '' && v !== null && v !== undefined) params[k] = v;
    }
    getTitles(params).then(setTitles).catch(() => setTitles([]));
  };

  const handleSubmit = async (data) => {
    setFormError('');
    try {
      if (editing) {
        await updateTitle(editing.id, data);
        setEditing(null);
      } else {
        await createTitle(data);
      }
      refreshList();
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить запись?')) return;
    try {
      await deleteTitle(id);
      refreshList();
    } catch (err) {
      alert(err?.response?.data?.error || 'Ошибка удаления');
    }
  };

  return (
    <div className="app">
      <h1>Каталог фильмов и сериалов</h1>

      <div className="layout">
        <div className="left">
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="list">
            {titles.length === 0 && <p className="empty">Ничего не найдено</p>}
            {titles.map((t) => (
              <TitleCard
                key={t.id}
                item={t}
                onEdit={(item) => { setEditing(item); setFormError(''); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <div className="right">
          <TitleForm
            key={editing ? editing.id : 'new'}
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => { setEditing(null); setFormError(''); }}
            error={formError}
          />
        </div>
      </div>
    </div>
  );
}