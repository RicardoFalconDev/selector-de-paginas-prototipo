import { useEffect, useRef, useState } from 'react';
import Checkbox from './Checkbox.jsx';
import PageCard from './PageCard.jsx';
import CustomScrollbar from './CustomScrollbar.jsx';
import { PAGES, TOTAL_PAGES } from '../data.js';
import { asset } from '../asset.js';

const FOCUSABLE = 'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])';

/**
 * Modal "Elegir páginas". Trabaja sobre un borrador que solo se aplica al confirmar.
 * `variant="sheet"` lo muestra como bottom sheet (mobile).
 */
export default function PageSelectorModal({
  initialSelected,
  onCancel,
  onConfirm,
  variant = 'modal',
  title = 'Elegir páginas',
  requireChange = false,
}) {
  const isSheet = variant === 'sheet';
  const [draft, setDraft] = useState(() => new Set(initialSelected));
  const modalRef = useRef(null);
  const gridRef = useRef(null);

  const allSelected = draft.size === TOTAL_PAGES;
  const unchanged = draft.size === initialSelected.size && [...draft].every((n) => initialSelected.has(n));
  const canConfirm = draft.size > 0 && !(requireChange && unchanged);

  const toggle = (n) =>
    setDraft((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  const setAll = (checked) => setDraft(checked ? new Set(PAGES.map((p) => p.number)) : new Set());

  useEffect(() => {
    const modal = modalRef.current;
    modal?.querySelector('.page-card')?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== 'Tab' || !modal) return;
      const nodes = [...modal.querySelectorAll(FOCUSABLE)];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  return (
    <div className={`overlay${isSheet ? ' overlay--sheet' : ''}`}>
      <div className="overlay__scrim" onClick={onCancel} />
      <div
        className={`modal${isSheet ? ' modal--sheet' : ''}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ps-title"
        aria-describedby="ps-subtitle"
      >
        {isSheet && <span className="sheet__dragger" aria-hidden="true" />}
        <div className="modal__header">
          <div className="modal__titles">
            <h2 className="modal__title" id="ps-title">{title}</h2>
            <p className="modal__subtitle" id="ps-subtitle">
              Seleccioná las páginas donde querés incluir la firma.
            </p>
          </div>
          <button className="modal__close" type="button" aria-label="Cerrar" onClick={onCancel}>
            <img src={asset('modal-close.svg')} alt="" />
          </button>
        </div>

        <div className="modal__divider" />

        <div className="modal__content">
          <div className="modal__toolbar">
            <div className="select-all">
              <Checkbox id="ps-all" labelledBy="ps-all-label" checked={allSelected} onChange={setAll} />
              <label className="select-all__label" id="ps-all-label" htmlFor="ps-all">
                Seleccionar todas
              </label>
            </div>
            <div className="count-badge" aria-live="polite">
              <span>
                <b>{draft.size}</b> de <b>{TOTAL_PAGES}</b>
                {!isSheet && ' seleccionadas'}
              </span>
            </div>
          </div>

          <div className="modal__scroll">
            <div className="page-grid-view" ref={gridRef}>
              <div className="page-grid">
                {PAGES.map((page) => (
                  <PageCard key={page.number} page={page} selected={draft.has(page.number)} onToggle={toggle} />
                ))}
              </div>
            </div>
            {!isSheet && <CustomScrollbar targetRef={gridRef} />}
          </div>
        </div>

        <div className="modal__divider" />

        <div className="modal__footer">
          <span className="modal__footer-count">
            {draft.size} {draft.size === 1 ? 'página seleccionada' : 'páginas seleccionadas'}
          </span>
          <div className="modal__footer-actions">
            <button className="btn btn--secondary btn--lg" type="button" onClick={onCancel}>
              Cancelar
            </button>
            <button
              className="btn btn--primary btn--lg"
              type="button"
              disabled={!canConfirm}
              onClick={() => onConfirm(draft)}
            >
              Confirmar selección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
