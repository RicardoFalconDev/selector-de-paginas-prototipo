import PageSelectorCard from './PageSelectorCard.jsx';
import { asset } from '../asset.js';

const ITEMS_BEFORE = [{ id: 'size', label: 'Tamaño de Firma', icon: 'ic-size.svg' }];
const ITEMS_AFTER = [
  { id: 'visibility', label: 'Visibilidad de la firma', icon: 'ic-visibility.svg' },
  { id: 'reorder', label: 'Reordenar datos', icon: 'ic-reorder.svg' },
  { id: 'logo', label: 'Agregar logo/imagen', icon: 'ic-logo.svg' },
  { id: 'permissions', label: 'Permisos de firma', icon: 'ic-lock.svg' },
];

function MenuItem({ label, icon }) {
  return (
    <button className="menu-item" type="button" aria-expanded={false}>
      <span className="menu-item__content">
        <img className="menu-item__icon" src={asset(icon)} alt="" />
        <span className="menu-item__label">{label}</span>
      </span>
      <img className="menu-item__caret" src={asset('caret-down.svg')} alt="" />
    </button>
  );
}

/** Panel lateral "Configurá tu firma". */
export default function ConfigPanel({ pagesOpen, onTogglePages, ...selectorProps }) {
  return (
    <aside className="config" aria-label="Configurá tu firma">
      <h2 className="config__title">Configurá tu firma</h2>
      <div className="config__list">
        {ITEMS_BEFORE.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}

        {pagesOpen ? (
          <div className="accordion">
            <button
              className="accordion__header"
              type="button"
              aria-expanded="true"
              aria-controls="pages-body"
              onClick={onTogglePages}
            >
              <span className="menu-item__content">
                <img className="menu-item__icon" src={asset('ic-pages.svg')} alt="" />
                <span className="menu-item__label">Páginas a firmar</span>
              </span>
              <img className="accordion__caret" src={asset('caret-up.svg')} alt="" />
            </button>
            <div className="accordion__body" id="pages-body">
              <PageSelectorCard {...selectorProps} />
            </div>
          </div>
        ) : (
          <button className="menu-item" type="button" aria-expanded="false" onClick={onTogglePages}>
            <span className="menu-item__content">
              <img className="menu-item__icon" src={asset('ic-pages.svg')} alt="" />
              <span className="menu-item__label">Páginas a firmar</span>
            </span>
            <img className="menu-item__caret" src={asset('caret-down.svg')} alt="" />
          </button>
        )}

        {ITEMS_AFTER.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
    </aside>
  );
}
