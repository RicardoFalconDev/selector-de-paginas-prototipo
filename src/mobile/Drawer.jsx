import { useEffect, useRef } from 'react';
import { asset } from '../asset.js';

/** Bottom sheet del patrón mobile: dragger, título centrado, divisores y acciones apiladas. */
export default function Drawer({ title, onClose, children, actions }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="m-overlay">
      <div className="m-overlay__scrim" onClick={onClose} />
      <div className="m-drawer" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <span className="sheet__dragger" aria-hidden="true" />
        <div className="m-drawer__header">
          <h2 className="m-drawer__title">{title}</h2>
          <button className="m-drawer__close" type="button" aria-label="Cerrar" onClick={onClose}>
            <img src={asset('close.svg')} alt="" />
          </button>
        </div>
        <div className="m-divider" />
        <div className="m-drawer__body">{children}</div>
        <div className="m-divider" />
        <div className="m-drawer__actions">{actions}</div>
      </div>
    </div>
  );
}
