import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Sparkle {
    id: number, 
    x: number, 
    y: number,
}

/** Each click drops a probe marker — a crosshair that pings once and fades. */
const SparkleEffect = () => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const newSparkle = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
            };
            setSparkles((prev) => [...prev, newSparkle]);

            setTimeout(() => {
                setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
            },600)
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    },[]);

    return (
        <>
            {sparkles.map((sparkle) => (
                <motion.div
                    key={sparkle.id}
                    className="fixed w-6 h-6 pointer-events-none z-50"
                    style={{
                        left: sparkle.x,
                        top: sparkle.y, 
                        transform: 'translate(-50%,-50%)',
                    }}
                    initial={{ scale: 0.4, opacity: 1}}
                    animate={{
                        scale:[0.4, 1.6],
                        opacity: [0.9, 0],
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut'}}
                >
                    <svg viewBox="0 0 24 24" className="w-full h-full text-phos">
                        {/* expanding ring + crosshair reticle */}
                        <circle
                            cx="12" cy="12" r="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            opacity="0.8"
                        />
                        <path
                            d="M12 1v5M12 18v5M1 12h5M18 12h5"
                            stroke="currentColor"
                            strokeWidth="1"
                            opacity="0.6"
                        />
                        <rect x="10.5" y="10.5" width="3" height="3" fill="currentColor" />
                    </svg>
                </motion.div>
            ))}
        </>
    );
};

export default SparkleEffect;
