import { useState, useEffect } from 'react';
import { FiTag, FiPlus, FiX } from 'react-icons/fi';
import LabelModal from '../../components/LabelModal';
import { useLabelStore } from '../../modules/labels/label.state';
import { useNotesStore } from '../../modules/notes/notes.state';
import { useUIStore } from '../../modules/ui/ui.state';
import { labelRepository } from '../../modules/labels/label.repository';

export default function LabelSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { labels, setLabels, setIsLoading, addLabel, removeLabel } = useLabelStore();
  const { removeLabelFromNotes } = useNotesStore();
  const { addFlashMessage } = useUIStore();

  useEffect(() => {
    const loadLabels = async () => {
      setIsLoading(true);
      try {
        const fetchedLabels = await labelRepository.getLabels();
        setLabels(fetchedLabels);
      } catch (error: any) {
        console.error('Failed to fetch labels:', error);
        addFlashMessage(
          error.response?.data?.message || 'ラベルの取得に失敗しました',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadLabels();
  }, [setLabels, setIsLoading, addFlashMessage]);

  const handleAddLabel = async (name: string, color: string) => {
    try {
      const newLabel = await labelRepository.createLabel(name, color);
      addLabel(newLabel);
      addFlashMessage('ラベルを作成しました', 'success');
    } catch (error: any) {
      console.error('Failed to create label:', error);
      addFlashMessage(
        error.response?.data?.message || 'ラベルの作成に失敗しました',
        'error'
      );
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await labelRepository.deleteLabel(id);
      removeLabel(id);
      removeLabelFromNotes(id);
      addFlashMessage('ラベルを削除しました', 'success');
    } catch (error: any) {
      console.error('Failed to delete label:', error);
      addFlashMessage(
        error.response?.data?.message || 'ラベルの削除に失敗しました',
        'error'
      );
    }
  };

  return (
    <>
      <aside className="label-sidebar">
        <div className="label-sidebar__header">
          <h3 className="label-sidebar__title">
            <FiTag className="label-sidebar__title-icon" />
            ラベル
          </h3>
          <button
            className="icon-btn label-sidebar__add-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus />
          </button>
        </div>

        <ul className="label-sidebar__list">
          {labels.map((label) => (
            <li key={label.id} className="label-sidebar__item">
              <div className="label-sidebar__label-btn">
                <span
                  className="label-sidebar__label-color"
                  style={{ backgroundColor: label.color }}
                ></span>
                <span className="label-sidebar__label-name">{label.name}</span>
              </div>
              <button
                className="label-sidebar__delete-btn"
                onClick={() => handleDeleteLabel(label.id)}
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {isModalOpen && (
        <LabelModal onClose={() => setIsModalOpen(false)} onSave={handleAddLabel} />
      )}
    </>
  );
}
