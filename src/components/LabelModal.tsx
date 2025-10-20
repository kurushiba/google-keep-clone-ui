import { FiX } from 'react-icons/fi';
import './LabelModal.css';

export default function LabelModal() {
  return (
    <div className="label-modal-overlay" onClick={() => {}}>
      <div className="label-modal" onClick={(e) => e.stopPropagation()}>
        <div className="label-modal__header">
          <h2 className="label-modal__title">新しいラベル</h2>
          <button className="icon-btn label-modal__close-btn" onClick={() => {}}>
            <FiX />
          </button>
        </div>

        <div className="label-modal__body">
          <div className="form-group">
            <label htmlFor="label-name" className="form-label">
              ラベル名
            </label>
            <input
              id="label-name"
              type="text"
              className="form-input"
              placeholder="ラベル名を入力（最大30文字）"
              maxLength={30}
              value=''
              onChange={() => {}}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">色</label>
            <div className="label-modal__colors">
              <button
                className="label-modal__color-option label-modal__color-option--selected"
                style={{ backgroundColor: '#f44336' }}
                onClick={() => {}}
                title="赤"
              />
              <button
                className="label-modal__color-option"
                style={{ backgroundColor: '#2196f3' }}
                onClick={() => {}}
                title="青"
              />
              <button
                className="label-modal__color-option"
                style={{ backgroundColor: '#4caf50' }}
                onClick={() => {}}
                title="緑"
              />
              <button
                className="label-modal__color-option"
                style={{ backgroundColor: '#ffc107' }}
                onClick={() => {}}
                title="黄"
              />
              <button
                className="label-modal__color-option"
                style={{ backgroundColor: '#9c27b0' }}
                onClick={() => {}}
                title="紫"
              />
              <button
                className="label-modal__color-option"
                style={{ backgroundColor: '#9e9e9e' }}
                onClick={() => {}}
                title="灰"
              />
            </div>
          </div>
        </div>

        <div className="label-modal__footer">
          <button className="btn btn-secondary" onClick={() => {}}>
            キャンセル
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {}}
            disabled={true}
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
