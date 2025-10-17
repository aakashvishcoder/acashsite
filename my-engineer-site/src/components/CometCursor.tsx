// src/components/CometCursor.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-50"
        style={{
          x: positions[0]?.x ?? -100,
          y: positions[0]?.y ?? -100,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Trail */}
      {positions.slice(1).map((pos, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-40"
          style={{
            x: pos.x,
            y: pos.y,
            translateX: '-50%',
            translateY: '-50%',
            backgroundColor: `rgba(0, 240, 255, ${1 - i * 0.1})`, // fade out
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