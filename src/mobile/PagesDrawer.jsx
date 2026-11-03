import Drawer from './Drawer.jsx';
import PageSelectorCard from '../components/PageSelectorCard.jsx';

/**
 * Drawer "Páginas a firmar". Sin páginas muestra el estado vacío (solo abrir el selector);
 * con páginas, el resumen con chips y la opción de misma posición.
 */
export default function PagesDrawer({
  draft,
  samePosition,
  onSamePositionChange,
  onOpenSelector,
  onRemove,
  onClear,
  canSave,
  onSave,
  onClose,
  openerRef,
}) {
  const isEmpty = draft.size === 0;

  return (
    <Drawer
      title="Páginas a firmar"
      onClose={onClose}
      actions={
        <>
          <button className="btn btn--primary btn--md" type="button" disabled={!canSave} onClick={onSave}>
            Guardar
          </button>
          <button className="btn btn--secondary btn--md" type="button" onClick={onClose}>
            Cancelar
          </button>
        </>
      }
    >
      {isEmpty && <p className="m-drawer__text">Elegí en qué páginas del documento querés ubicar la firma.</p>}
      <PageSelectorCard
        selected={draft}
        openerRef={openerRef}
        onOpen={onOpenSelector}
        onRemove={onRemove}
        onClear={onClear}
        samePosition={samePosition}
        onSamePositionChange={onSamePositionChange}
      />
    </Drawer>
  );
}
