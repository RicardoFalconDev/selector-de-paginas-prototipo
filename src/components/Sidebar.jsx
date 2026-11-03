import { useEffect, useRef } from 'react';
import { PAGES } from '../data.js';
import { asset } from '../asset.js';

/** Miniaturas del documento abierto en el visor. */
export default function Sidebar({ currentPage, onSelectPage }) {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentPage]);

  return (
    <aside className="sidebar" aria-label="Páginas del documento">
      <p className="sidebar__count">{PAGES.length} páginas</p>
      <div className="sidebar__list" ref={listRef}>
        {PAGES.map(({ number: n }) => {
          const active = n === currentPage;
          return (
            <button
              key={n}
              type="button"
              className={`thumb${active ? ' thumb--active' : ''}`}
              onClick={() => onSelectPage(n)}
              aria-current={active ? 'page' : undefined}
              aria-label={`Página ${n}`}
            >
              <span className="thumb__page">
                <img src={asset('thumb-b.png')} alt="" />
              </span>
              <span className="thumb__num">{n}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
