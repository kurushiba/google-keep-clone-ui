import { useState, useEffect } from 'react';
import { FiX, FiImage, FiTag, FiCheck } from 'react-icons/fi';
import { Note } from '../../modules/notes/note.entity';
import { useLabelStore } from '../../modules/labels/label.state';
import { labelRepository } from '../../modules/labels/label.repository';
import { useUIStore } from '../../modules/ui/ui.state';

export interface NoteSubmitParams {
  title?: string;
  content?: string;
  labelIds?: string[];
  imageFile?: File;
}

interface NoteModalProps {
  note?: Note;
  onClose: () => void;
  onSubmit: (params: NoteSubmitParams) => Promise<void>;
}

export default function NoteModal({ note, onClose, onSubmit }: NoteModalProps) {
  const { labels, setLabels } = useLabelStore();
  const { addFlashMessage } = useUIStore();

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [imagePreview, setImagePreview] = useState<string | null>(
    note?.imageUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    note?.labels.map((l) => l.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ラベル一覧取得
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const fetchedLabels = await labelRepository.getLabels();
        setLabels(fetchedLabels);
      } catch (error: any) {
        addFlashMessage(
          error.response?.data?.message || 'ラベルの取得に失敗しました',
          'error'
        );
      }
    };

    if (labels.length === 0) {
      loadLabels();
    }
  }, [labels.length, setLabels, addFlashMessage]);

  // 画像を削除
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  // 画像ファイル選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      addFlashMessage(
        '画像ファイルはJPEG、PNG、GIFのみ対応しています',
        'error'
      );
      return;
    }

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      addFlashMessage('ファイルサイズは5MB以下にしてください', 'error');
      return;
    }

    // プレビュー生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // ラベルの選択/解除を切り替え
  const toggleLabel = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      setSelectedLabelIds(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      setSelectedLabelIds([...selectedLabelIds, labelId]);
    }
  };

  // メモ送信
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        content,
        labelIds: selectedLabelIds.length > 0 ? selectedLabelIds : undefined,
        imageFile: imageFile || undefined,
      });
    } catch (error) {
      // エラーは親コンポーネントで処理済み
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='note-modal-overlay' onClick={onClose}>
      <div className='note-modal' onClick={(e) => e.stopPropagation()}>
        <div className='note-modal__header'>
          <h2 className='note-modal__title'>メモを入力</h2>
          <button className='icon-btn note-modal__close-btn' onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className='note-modal__body'>
          <div className='form-group'>
            <input
              type='text'
              className='form-input note-modal__title-input'
              placeholder='タイトル'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <textarea
              className='form-textarea note-modal__content-textarea'
              placeholder='メモを入力...'
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          <div className='note-modal__labels-section'>
            <label className='note-modal__section-label'>
              <FiTag className='note-modal__section-icon' />
              ラベル
            </label>
            <div className='note-modal__labels'>
              {labels.map((label) => (
                <button
                  key={label.id}
                  className={`note-modal__label-tag ${
                    selectedLabelIds.includes(label.id)
                      ? 'note-modal__label-tag--selected'
                      : ''
                  }`}
                  style={{
                    backgroundColor: selectedLabelIds.includes(label.id)
                      ? label.color
                      : 'transparent',
                    color: selectedLabelIds.includes(label.id)
                      ? 'white'
                      : label.color,
                    border: `2px solid ${label.color}`,
                  }}
                  onClick={() => toggleLabel(label.id)}
                >
                  {selectedLabelIds.includes(label.id) && (
                    <FiCheck className='note-modal__label-check' />
                  )}
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          <div className='note-modal__images-section'>
            <label className='note-modal__section-label'>
              <FiImage className='note-modal__section-icon' />
              画像（1枚まで）
            </label>
            <div className='note-modal__images'>
              {imagePreview ? (
                <div className='note-modal__image-preview'>
                  <img
                    src={imagePreview}
                    alt='プレビュー'
                    className='note-modal__image'
                  />
                  <button
                    className='note-modal__image-remove'
                    onClick={handleRemoveImage}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label className='note-modal__upload-btn'>
                  <FiImage />
                  <span>画像をアップロード</span>
                  <input
                    type='file'
                    accept='image/jpeg,image/png,image/gif'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className='note-modal__footer'>
          <button
            className='btn btn-secondary'
            onClick={onClose}
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            className='btn btn-primary'
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
