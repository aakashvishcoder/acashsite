import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Sparkle {
    id: number, 
    x: number, 
    y: number,
}

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
                    className="fixed w-2 h-2 pointer-events-none z-50"
                    style={{
                        left: sparkle.x,
                        top: sparkle.y, 
                        transform: 'translate(-50%,-50%)',
                    }}
                    initial={{ scale: 0, opacity: 1}}
                    animate={{
                        scale:[0, 1.2, 0],
                        opacity: [1, 0.8, 0],
                        rotate: [0, 180],
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut'}}
                >
                    <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-300">
                        <path
                            fill="currentColor"
                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.932-7.417 3.932 1.481-8.279-6.064-5.828 8.332-1.151z"
                        />
                    </svg>
                </motion.div>
            ))}
        </>
    );
};

export default SparkleEffect;