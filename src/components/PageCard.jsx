import { asset } from '../asset.js';

/** Miniatura seleccionable del modal "Elegir páginas". */
export default function PageCard({ page, selected, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={`Página ${page.number}`}
      className={`page-card${selected ? ' page-card--selected' : ''}`}
      onClick={() => onToggle(page.number)}
    >
      <span className="page-card__frame">
        <span className="page-card__sheet">
          <img className="page-card__img" src={page.thumb} alt="" loading="lazy" />
        </span>
        <span className="page-card__check">{selected && <img src={asset('check.svg')} alt="" />}</span>
      </span>
      <span className="page-card__label">Pág {page.number}</span>
    </button>
  );
}
