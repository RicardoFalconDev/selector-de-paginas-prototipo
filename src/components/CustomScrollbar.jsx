import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_THUMB = 32;

/** Scrollbar del sistema (track 16px, thumb gray/700) sincronizada con un contenedor. */
export default function CustomScrollbar({ targetRef }) {
  const innerRef = useRef(null);
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false });

  const update = useCallback(() => {
    const el = targetRef.current;
    const track = innerRef.current;
    if (!el || !track) return;
    const trackH = track.clientHeight;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: trackH, visible: false });
      return;
    }
    const height = Math.max(MIN_THUMB, (clientHeight / scrollHeight) * trackH);
    const top = (scrollTop / (scrollHeight - clientHeight)) * (trackH - height);
    setThumb({ top, height, visible: true });
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [targetRef, update]);

  const onThumbPointerDown = (e) => {
    const el = targetRef.current;
    const track = innerRef.current;
    if (!el || !track) return;
    e.preventDefault();
    const startY = e.clientY;
    const startScroll = el.scrollTop;
    const ratio = (el.scrollHeight - el.clientHeight) / (track.clientHeight - thumb.height);
    const onMove = (ev) => {
      el.scrollTop = startScroll + (ev.clientY - startY) * ratio;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onTrackPointerDown = (e) => {
    if (e.target !== innerRef.current) return;
    const el = targetRef.current;
    const rect = innerRef.current.getBoundingClientRect();
    const dir = e.clientY < rect.top + thumb.top ? -1 : 1;
    el.scrollBy({ top: dir * el.clientHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <div className="scrolltrack" aria-hidden="true">
      <div className="scrolltrack__inner" ref={innerRef} onPointerDown={onTrackPointerDown}>
        {thumb.visible && (
          <div
            className="scrolltrack__thumb"
            style={{ top: thumb.top, height: thumb.height }}
            onPointerDown={onThumbPointerDown}
          />
        )}
      </div>
    </div>
  );
}
