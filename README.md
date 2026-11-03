# Selector de páginas — Prototipo (Desktop + Mobile) · FID by Lakaut

**Demo:** https://ricardofalcondev.github.io/selector-de-paginas-prototipo/

Prototipo funcional del flujo **Configurar firma → Páginas a firmar**, alineado a la versión final del Figma de handoff.

- **Desktop:** https://ricardofalcondev.github.io/selector-de-paginas-prototipo/#desktop
- **Mobile (360×800):** https://ricardofalcondev.github.io/selector-de-paginas-prototipo/#mobile

En un celular se abre directamente la vista mobile a pantalla completa.

## Flujo

- Documento de 32 páginas; la firma arranca en la página 1 con "Misma posición en todas las páginas".
- Selector de páginas con "Seleccionar todas", contador en vivo y Confirmar/Cancelar.
- Resumen con chips (3 por fila, "+N"), Limpiar y misma posición.
- Mobile: barra de acciones desplazable, drawers y toast al guardar.

## Correr localmente

```bash
npm install
npm run dev
```

## Stack

React 18 + Vite, CSS con tokens extraídos de Figma (`src/tokens.css`).
