import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const CometCursor = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 30, stiffness: 300 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const rotate = useTransform(
        smoothX, 
        [0, window.innerWidth],
        [-30, 30]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    },[mouseX, mouseY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-50"
                style={{
                    x: smoothX, 
                    y: smoothY, 
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {[...Array(5)].map((_,i) => {
                const delay = i * 0.03;
                return (
                    <motion.div
                        key={i}
                        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-300/70 pointer-events-none z-40"
                        style={{
                            x: smoothX,
                            y: smoothY,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.7, 0],
                        }}
                        transition={{
                            duration: 0.6, 
                            delay,
                            repeat: Infinity, 
                            ease: "easeOut"
                        }}
                    />
                );
            })}
        </>
    );
};

export default CometCursor;