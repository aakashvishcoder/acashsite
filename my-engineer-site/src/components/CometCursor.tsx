import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Oscilloscope probe: a crosshair reticle rides the pointer and leaves a
 * decaying trail of sample points behind it.
 */
const CometCursor = () => {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const historyRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      historyRef.current = [newPos, ...historyRef.current.slice(0, 9)]; // keep last 10
      setPositions([...historyRef.current]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* reticle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen"
        style={{
          x: positions[0]?.x ?? -100,
          y: positions[0]?.y ?? -100,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" className="text-phos">
          <path
            d="M13 0v7M13 19v7M0 13h7M19 13h7"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.85"
          />
          <circle cx="13" cy="13" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <rect x="12" y="12" width="2" height="2" fill="currentColor" />
        </svg>
      </motion.div>

      {/* decaying sample points */}
      {positions.slice(1).map((pos, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-[3px] h-[3px] pointer-events-none z-40"
          style={{
            x: pos.x,
            y: pos.y,
            translateX: '-50%',
            translateY: '-50%',
            backgroundColor: `rgba(77, 255, 159, ${0.55 - i * 0.055})`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </>
  );
};

export default CometCursor;
