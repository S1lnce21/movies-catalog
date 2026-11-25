export default function TitleCard({ item, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{item.title}</h3>
        <span className={`badge ${item.type}`}>
          {item.type === 'movie' ? 'Фильм' : 'Сериал'}
        </span>
      </div>
      <p className="meta">{item.year} · {item.genre_name || 'Без жанра'} · ⭐ {item.rating ?? '—'}</p>
      <div className="actions">
        <button onClick={() => onEdit(item)}>Редактировать</button>
        <button className="danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
    </div>
  );
}