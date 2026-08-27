import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project, projects } from '../data/projects';

type Cmd = {
  id: string;
  label: string;
  hint: string;
  kind: 'nav' | 'link' | 'project';
  run: () => void;
};

interface Props {
  onOpenProject: (p: Project) => void;
}

/** Ctrl/Cmd-K launcher: jump to a section, open a project, or hit a link. */
const CommandPalette = ({ onOpenProject }: Props) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const go = (id: string) => () =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const nav: Cmd[] = [
      { id: 'n-home', label: 'home', hint: 'section', kind: 'nav', run: go('home') },
      { id: 'n-skills', label: 'skills', hint: 'section', kind: 'nav', run: go('skills') },
      { id: 'n-projects', label: 'projects', hint: 'section', kind: 'nav', run: go('projects') },
      { id: 'n-contact', label: 'contact', hint: 'section', kind: 'nav', run: go('contact') },
    ];

    const links: Cmd[] = [
      {
        id: 'l-gh', label: 'github', hint: 'external', kind: 'link',
        run: () => window.open('https://github.com/aakashvishcoder', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'l-li', label: 'linkedin', hint: 'external', kind: 'link',
        run: () => window.open('http://www.linkedin.com/in/aakash-vishnuvarth-426b15303', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'l-mail', label: 'email', hint: 'mailto', kind: 'link',
        run: () => { window.location.href = 'mailto:aakashvish07@gmail.com'; },
      },
    ];

    const projectCmds: Cmd[] = projects.map((p) => ({
      id: `p-${p.id}`,
      label: p.title,
      hint: p.group.toLowerCase(),
      kind: 'project',
      run: () => onOpenProject(p),
    }));

    return [...nav, ...links, ...projectCmds];
  }, [onOpenProject]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands.slice(0, 12);
    return commands
      .filter((c) => c.label.toLowerCase().includes(needle) || c.hint.includes(needle))
      .slice(0, 12);
  }, [q, commands]);

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      // focus after the enter animation has begun
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setCursor(0), [q]);

  const commit = (c?: Cmd) => {
    const target = c ?? results[cursor];
    if (!target) return;
    setOpen(false);
    target.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[14vh] px-4 bg-board-900/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="term-panel fiducial w-full max-w-lg overflow-hidden"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="term-bar">
              <span className="text-phos/70">&#9679;</span>
              <span>command palette</span>
              <span className="ml-auto normal-case tracking-normal text-etch-bright">esc</span>
            </div>

            <div className="flex items-center gap-2 border-b border-etch px-4 py-3">
              <span className="font-mono text-sm text-phos">$</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="jump to a section, project, or link…"
                className="flex-1 bg-transparent font-mono text-sm text-[#dfeee6] placeholder:text-etch-bright focus:outline-none"
              />
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto py-1">
              {results.length === 0 ? (
                <p className="px-4 py-6 font-mono text-sm text-[#7d938a]">
                  <span className="text-phos-dim select-none">&gt; </span>
                  no matches.
                </p>
              ) : (
                results.map((c, i) => (
                  <button
                    key={c.id}
                    data-idx={i}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => commit(c)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left font-mono text-sm transition-colors ${
                      i === cursor ? 'bg-phos/10 text-phos' : 'text-[#b8ccc0] hover:bg-board-700/60'
                    }`}
                  >
                    <span className={i === cursor ? 'text-phos' : 'text-etch-bright'}>
                      {i === cursor ? '›' : ' '}
                    </span>
                    <span className="truncate">{c.label}</span>
                    <span className="ml-auto font-tech text-[10px] uppercase tracking-[0.16em] text-etch-bright">
                      {c.hint}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
