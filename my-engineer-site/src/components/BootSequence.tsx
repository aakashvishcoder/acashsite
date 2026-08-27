import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LINES: { text: string; ok?: string }[] = [
  { text: 'ACASH BIOS v1.0 — power-on self test' },
  { text: 'CPU ......................', ok: 'OK' },
  { text: 'MEM ............... 16384K', ok: 'OK' },
  { text: 'GPU ............... WebGL2', ok: 'OK' },
  { text: 'NET ...............  eth0 ', ok: 'LINK UP' },
  { text: 'mounting /dev/portfolio ..', ok: 'OK' },
  { text: 'loading profile: aakash_vishnuvarth' },
  { text: 'starting shell ...' },
];

const STEP_MS = 130;
const KEY = 'acash.booted';

/**
 * Plays once per tab session. Any input skips it, and it is bypassed
 * entirely for reduced-motion users so nothing gates the content.
 */
const BootSequence = () => {
  const skipped = useRef(false);
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (sessionStorage.getItem(KEY)) return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible) {
      sessionStorage.setItem(KEY, '1');
      return;
    }
    document.body.style.overflow = 'hidden';

    const finish = () => {
      if (skipped.current) return;
      skipped.current = true;
      sessionStorage.setItem(KEY, '1');
      setVisible(false);
    };

    const tick = window.setInterval(() => {
      setShown((n) => {
        if (n >= LINES.length) return n;
        return n + 1;
      });
    }, STEP_MS);

    const done = window.setTimeout(finish, LINES.length * STEP_MS + 420);

    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    window.addEventListener('wheel', finish, { passive: true });

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('wheel', finish);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9997] bg-board-900 flex items-center justify-center p-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="w-full max-w-lg font-mono text-xs md:text-sm">
            {LINES.slice(0, shown).map((l, i) => (
              <div key={i} className="flex gap-3 text-[#8fa89a] leading-relaxed">
                <span className="whitespace-pre">{l.text}</span>
                {l.ok && <span className="text-phos glow">[ {l.ok} ]</span>}
              </div>
            ))}
            <div className="mt-2 text-phos-dim prompt caret" />
            <p className="mt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-etch-bright">
              press any key to skip
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
