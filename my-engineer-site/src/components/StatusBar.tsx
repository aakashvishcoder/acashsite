import { useEffect, useState } from 'react';

const SECTIONS = ['home', 'skills', 'projects', 'contact'];

/** tmux-style statusline pinned to the bottom of the viewport. */
const StatusBar = () => {
  const [active, setActive] = useState('home');
  const [pct, setPct] = useState(0);
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);

      // Whichever section covers the vertical middle wins.
      const mid = window.innerHeight / 2;
      let current = active;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { current = id; break; }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [active]);

  useEffect(() => {
    const t = window.setInterval(
      () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false })),
      1000
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-stretch border-t border-etch bg-board-900/90 backdrop-blur-sm font-tech text-[10px] md:text-[11px] uppercase tracking-[0.16em]">
        <span className="flex items-center gap-2 bg-phos/10 border-r border-etch px-3 py-1.5 text-phos">
          <span className="inline-block w-1.5 h-1.5 bg-phos rounded-full animate-blip" />
          {active}
        </span>

        <span className="hidden sm:flex items-center px-3 py-1.5 text-phos-dim border-r border-etch">
          ~/aakash
        </span>

        <span className="flex-1" />

        <span className="hidden md:flex items-center px-3 py-1.5 text-etch-bright border-l border-etch pointer-events-auto">
          <kbd className="text-phos-dim">ctrl</kbd>
          <span className="mx-1">+</span>
          <kbd className="text-phos-dim">k</kbd>
          <span className="ml-2">palette</span>
        </span>

        <span className="flex items-center px-3 py-1.5 text-phos-dim border-l border-etch tabular-nums">
          {pct}%
        </span>

        <span className="hidden sm:flex items-center px-3 py-1.5 text-phos-dim border-l border-etch tabular-nums">
          {clock}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
