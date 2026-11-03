import { useEffect } from 'react';
import { asset } from '../asset.js';

const AUTO_HIDE_MS = 4000;

/** Toast de éxito del sistema (variante Success con título y descripción). */
export default function Toast({ title, description, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <img className="toast__icon" src={asset('toast-check.svg')} alt="" />
      <div className="toast__content">
        <p className="toast__title">{title}</p>
        <p className="toast__desc">{description}</p>
      </div>
      <button className="toast__close" type="button" aria-label="Cerrar aviso" onClick={onClose}>
        <img src={asset('toast-close.svg')} alt="" />
      </button>
    </div>
  );
}
