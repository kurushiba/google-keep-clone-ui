import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiPlus, FiLogOut } from 'react-icons/fi';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useUIStore } from '../../modules/ui/ui.state';
import { useNotesStore } from '../../modules/notes/notes.state';
import { noteRepository } from '../../modules/notes/note.repository';
import { Note } from '../../modules/notes/note.entity';
import SearchBar from './SearchBar';
import LabelSidebar from './LabelSidebar';
import NoteCard from './NoteCard';
import NoteModal, { type NoteSubmitParams } from './NoteModal';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserStore();
  const { addFlashMessage } = useUIStore();
  const {
    notes,
    page,
    hasMore,
    isLoading,
    searchQuery,
    setNotes,
    addNotes,
    setPage,
    setHasMore,
    setIsLoading,
    setSearchQuery,
    addNote,
    updateNote,
    removeNote,
    resetNotes,
  } = useNotesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const limit = 9;

  // ログインチェック
  if (!currentUser) {
    return <Navigate to='/login' replace />;
  }

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    addFlashMessage('ログアウトしました', 'success');
    navigate('/login');
  };

  // メモ一覧取得（初回ロード用）
  const loadInitialNotes = async () => {
    setIsLoading(true);
    try {
      const response = await noteRepository.getNotes(1, limit, searchQuery);
      setNotes(response.notes);
      setPage(2);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error: any) {
      addFlashMessage(
        error.response?.data?.message || 'メモの取得に失敗しました',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 追加メモ取得（無限スクロール用）
  const loadMoreNotes = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await noteRepository.getNotes(page, limit, searchQuery);
      addNotes(response.notes);
      setPage(page + 1);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error: any) {
      addFlashMessage(
        error.response?.data?.message || 'メモの取得に失敗しました',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 検索ハンドラー
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  // メモ作成ハンドラー
  const handleCreateNote = async (params: NoteSubmitParams) => {
    try {
      const newNote = await noteRepository.createNote(params);
      addNote(newNote);
      addFlashMessage('メモを作成しました', 'success');
      setIsModalOpen(false);
    } catch (error: any) {
      addFlashMessage(
        error.response?.data?.message || 'メモの作成に失敗しました',
        'error'
      );
      throw error;
    }
  };

  // メモ更新ハンドラー
  const handleUpdateNote = async (params: NoteSubmitParams) => {
    if (!editingNote) return;

    try {
      const updatedNote = await noteRepository.updateNote(
        editingNote.id,
        params
      );
      updateNote(editingNote.id, updatedNote);
      addFlashMessage('メモを更新しました', 'success');
      setEditingNote(null);
      setIsModalOpen(false);
    } catch (error: any) {
      addFlashMessage(
        error.response?.data?.message || 'メモの更新に失敗しました',
        'error'
      );
      throw error;
    }
  };

  // メモ削除ハンドラー
  const handleDeleteNote = async (id: string) => {
    try {
      await noteRepository.deleteNote(id);
      removeNote(id);
      addFlashMessage('メモを削除しました', 'success');
    } catch (error: any) {
      addFlashMessage(
        error.response?.data?.message || 'メモの削除に失敗しました',
        'error'
      );
    }
  };

  // 編集モーダルを開く
  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setEditingNote(null);
    setIsModalOpen(false);
  };

  // 初回ロード
  useEffect(() => {
    loadInitialNotes();
  }, []);

  // 検索クエリ変更時にメモをリセットして再取得
  useEffect(() => {
    resetNotes();
    loadInitialNotes();
  }, [searchQuery]);

  // Intersection Observer で無限スクロールを実装
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMoreNotes();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [hasMore, isLoading]);

  return (
    <div className='home'>
      <header className='home-header'>
        <div className='home-header__left'>
          <div className='home-header__logo'>
            <svg
              className='home-header__logo-icon'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z' />
            </svg>
            <span className='home-header__logo-text'>Google Keep Clone</span>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className='home-header__right'>
          <span className='home-header__user'>
            {currentUser?.name || 'ゲスト'}
          </span>
          <button className='icon-btn home-header__logout-btn' onClick={logout}>
            <FiLogOut />
          </button>
        </div>
      </header>

      <div className='home-main'>
        <LabelSidebar />

        <main className='home-content'>
          <div className='home-content__header'>
            <h2 className='home-content__title'>すべてのメモ</h2>
            <button
              className='btn btn-primary home-content__add-btn'
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus />
              <span>新しいメモ</span>
            </button>
          </div>

          {/* メモ一覧 */}
          {notes.length > 0 && (
            <div className='notes-grid'>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}

          {/* 無限スクロールのトリガー要素 */}
          <div ref={loadMoreRef} style={{ height: '20px' }} />

          {/* ローディング表示 */}
          {isLoading && (
            <div
              className='loading'
              style={{ textAlign: 'center', padding: '20px' }}
            >
              読み込み中...
            </div>
          )}

          {/* 全件取得完了メッセージ */}
          {!hasMore && notes.length > 0 && (
            <div
              className='no-more'
              style={{ textAlign: 'center', padding: '20px', color: '#666' }}
            >
              全てのメモを表示しました
            </div>
          )}

          {/* メモがない場合 */}
          {!isLoading && notes.length === 0 && (
            <div className='no-notes'>
              <p>メモがありません</p>
              <p>新しいメモを作成してみましょう</p>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <NoteModal
          note={editingNote || undefined}
          onClose={handleCloseModal}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        />
      )}
    </div>
  );
}
