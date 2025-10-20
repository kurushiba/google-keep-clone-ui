import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { Note } from '../../modules/notes/note.entity';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  // 日付をフォーマット
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 削除確認
  const handleDelete = () => {
    if (window.confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  return (
    <div className="note-card">
      {note.imageUrl && (
        <div className="note-card__image-container">
          <img src={note.imageUrl} alt="メモの画像" className="note-card__image" />
          <button className="note-card__image-remove">
            <FiX />
          </button>
        </div>
      )}

      {note.title && <h3 className="note-card__title">{note.title}</h3>}

      {note.content && <p className="note-card__content">{note.content}</p>}

      {note.labels && note.labels.length > 0 && (
        <div className="note-card__labels">
          {note.labels.map((label) => (
            <span
              key={label.id}
              className="note-card__label"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="note-card__footer">
        <span className="note-card__date">{formatDate(note.createdAt)}</span>
        <div className="note-card__actions">
          <button
            className="icon-btn note-card__action-btn"
            onClick={() => onEdit(note)}
          >
            <FiEdit2 />
          </button>
          <button
            className="icon-btn note-card__action-btn"
            onClick={handleDelete}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
