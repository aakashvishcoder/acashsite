import { useCallback, useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface CarouselProps {
  /** Text shown in the window title bar, e.g. "ls ./skills". */
  title: string;
  /** Rendered at the right of the title bar, before the nav buttons. */
  toolbar?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

/**
 * A horizontal rail framed as a terminal window. Scrolls by one viewport
 * of cards via the title-bar buttons, arrow keys, or pointer drag; the
 * underlying element is a native scroller so trackpads and touch work
 * without any of it being reimplemented.
 */
const Carousel = ({ title, toolbar, label, children }: CarouselProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, [sync, children]);

  const page = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Advance by whole cards so the snap points stay aligned.
    const card = el.querySelector<HTMLElement>(':scope > *');
    const step = card ? card.offsetWidth + 12 : el.clientWidth * 0.8;
    const perView = Math.max(1, Math.floor(el.clientWidth / step));
    el.scrollBy({ left: dir * step * perView, behavior: 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); page(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1); }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Let the browser handle touch panning natively.
    if (e.pointerType === 'touch') return;
    const el = railRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = railRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    // Only take over once it's clearly a drag, not a click.
    if (drag.current.moved > 4) {
      if (!dragging) setDragging(true);
      el.scrollLeft = drag.current.startScroll - dx;
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dragging) setDragging(false);
  };

  return (
    <div className="term-panel fiducial overflow-hidden">
      <div className="term-bar">
        <span className="text-phos/70">&#9679;</span>
        <span className="truncate">{title}</span>

        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          {/* scroll position readout */}
          <div className="hidden sm:block relative w-16 h-1 bg-board-900 border border-etch">
            <div
              className="absolute inset-y-0 left-0 bg-phos-dim transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <button className="navbtn" onClick={() => page(-1)} disabled={atStart} aria-label="Scroll left">
            <IconChevronLeft size={14} />
          </button>
          <button className="navbtn" onClick={() => page(1)} disabled={atEnd} aria-label="Scroll right">
            <IconChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className={`rail ${dragging ? 'dragging' : 'cursor-grab'}`}
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;
