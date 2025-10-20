import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import { useUIStore } from '../modules/ui/ui.state';
import './FlashMessage.css';

export default function FlashMessage() {
  const { flashMessages, removeFlashMessage } = useUIStore();

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <FiCheckCircle />;
      case 'error':
        return <FiXCircle />;
      case 'info':
        return <FiAlertCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  return (
    <div className="flash-message-container">
      {flashMessages.map((msg) => (
        <div key={msg.id} className={`flash-message flash-message--${msg.type}`}>
          <div className="flash-message__icon">{getIcon(msg.type)}</div>
          <div className="flash-message__content">{msg.message}</div>
          <button className="flash-message__close" onClick={() => removeFlashMessage(msg.id)}>
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
}
