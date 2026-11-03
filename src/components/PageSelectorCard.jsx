import { useState } from 'react';
import Checkbox from './Checkbox.jsx';
import PageChip from './PageChip.jsx';
import { MAX_VISIBLE_CHIPS } from '../data.js';
import { asset } from '../asset.js';

/** Contenido del acordeón "Páginas a firmar": abre el modal y resume la selección. */
export default function PageSelectorCard({
  selected,
  onOpen,
  onRemove,
  onClear,
  openerRef,
  samePosition,
  onSamePositionChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const pages = [...selected].sort((a, b) => a - b);
  const visible = expanded ? pages : pages.slice(0, MAX_VISIBLE_CHIPS);
  const hidden = pages.length - visible.length;

  return (
    <div className="ps-card">
      <button ref={openerRef} className="ps-card__open" type="button" onClick={onOpen}>
        <img src={asset('ic-grid.svg')} alt="" />
        Abrir selector de páginas
      </button>

      {pages.length > 0 && (
        <div className="ps-card__summary">
          <div className="ps-card__row">
            <span className="ps-card__count">
              {pages.length} {pages.length === 1 ? 'seleccionada' : 'seleccionadas'}
            </span>
            <button
              className="ps-card__clear"
              type="button"
              onClick={() => {
                setExpanded(false);
                onClear();
              }}
            >
              Limpiar
            </button>
          </div>
          <div className="chips">
            {visible.map((p) => (
              <PageChip key={p} page={p} onRemove={onRemove} />
            ))}
            {hidden > 0 && (
              <button
                className="chip chip--more"
                type="button"
                aria-label={`Ver ${hidden} páginas más`}
                onClick={() => setExpanded(true)}
              >
                +{hidden}
              </button>
            )}
          </div>
        </div>
      )}

      {pages.length > 0 && (
        <div className="same-position">
          <Checkbox
            id="same-position"
            labelledBy="same-position-label"
            checked={samePosition}
            onChange={onSamePositionChange}
          />
          <label className="same-position__label" id="same-position-label" htmlFor="same-position">
            Misma posición en todas las páginas
          </label>
        </div>
      )}
    </div>
  );
}
