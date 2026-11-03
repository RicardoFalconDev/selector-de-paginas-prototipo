import { asset } from '../asset.js';

import { useEffect, useRef, useState } from 'react';

const ZOOM_STEP = 10;
const ZOOM_MIN = 50;
const ZOOM_MAX = 200;

// Tamaño de la hoja en Figma y espacio que ocupa el resto del visor.
const DOC_WIDTH = 462;
const DOC_HEIGHT = 653.788;
const ZOOMBAR_HEIGHT = 48;

/** Medidas del contenedor en desktop: padding vertical del área de trabajo y gap del visor. */
const DESKTOP_FIT = { paddingX: null, paddingY: 48, gap: 16.604 };

/**
 * Escala con la que la hoja ocupa todo el espacio disponible del contenedor (zoom 100%).
 * Con `paddingX` en null solo se ajusta al alto; si tiene valor, también al ancho.
 */
function useFitScale(ref, { paddingX, paddingY, gap }) {
  const [fit, setFit] = useState(1);

  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container) return undefined;
    const update = () => {
      const byHeight = (container.clientHeight - paddingY - gap - ZOOMBAR_HEIGHT) / DOC_HEIGHT;
      const byWidth = paddingX === null ? Infinity : (container.clientWidth - paddingX) / DOC_WIDTH;
      setFit(Math.max(0.3, Math.min(byHeight, byWidth)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [ref, paddingX, paddingY, gap]);

  return fit;
}

/** Documento con la estampa de firma y la barra de zoom/paginación. */
export default function DocumentViewer({ zoom, onZoom, currentPage, totalPages, onSelectPage, fit = DESKTOP_FIT }) {
  const viewerRef = useRef(null);
  const scale = useFitScale(viewerRef, fit) * (zoom / 100);

  return (
    <section className="viewer" ref={viewerRef} aria-label="Vista previa del documento">
      <div className="viewer__stage" style={{ width: DOC_WIDTH * scale, height: DOC_HEIGHT * scale }}>
        <div className="doc" style={{ transform: `scale(${scale})` }}>
          <img className="doc__img" src={asset('doc-b.png')} alt="Autorización para retiro de pertenencias" />
          <div className="stamp" aria-label="Firma">
            <div className="stamp__box">
              <p className="stamp__title">Firmado digitalmente por:</p>
              <div className="stamp__lines">
                <p className="stamp__name">Isaac Cristian Meneses</p>
                <p>CUI: 20960814352</p>
                <p>Fecha: 16/4/26, 12:41 p. m.</p>
                <p>Emisor: AC-LAKAUT2</p>
              </div>
            </div>
            <span className="stamp__handle stamp__handle--tl" />
            <span className="stamp__handle stamp__handle--tr" />
            <span className="stamp__handle stamp__handle--bl" />
            <span className="stamp__handle stamp__handle--br" />
          </div>
        </div>
      </div>

      <div className="zoombar">
        <div className="zoombar__group">
          <button
            className="zoombar__icon"
            type="button"
            aria-label="Alejar"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => onZoom(Math.max(ZOOM_MIN, zoom - ZOOM_STEP))}
          >
            <img src={asset('zoom-remove.svg')} alt="" />
          </button>
          <span className="zoombar__value zoombar__value--zoom">{zoom}%</span>
          <button
            className="zoombar__icon"
            type="button"
            aria-label="Acercar"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => onZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP))}
          >
            <img src={asset('zoom-add.svg')} alt="" />
          </button>
        </div>
        <span className="zoombar__divider" />
        <div className="zoombar__group">
          <button
            className="zoombar__icon"
            type="button"
            aria-label="Página anterior"
            disabled={currentPage <= 1}
            onClick={() => onSelectPage(currentPage - 1)}
          >
            <img src={asset('arrow-left.svg')} alt="" />
          </button>
          <span className="zoombar__value">
            <b>{currentPage}</b>/{totalPages}
          </span>
          <button
            className="zoombar__icon"
            type="button"
            aria-label="Página siguiente"
            disabled={currentPage >= totalPages}
            onClick={() => onSelectPage(currentPage + 1)}
          >
            <img src={asset('arrow-right.svg')} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
}
