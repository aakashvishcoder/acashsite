import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';

const AnimatedBackground = () => {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 75}}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
};

const background3d = () => {
    return (
        <div className="fixed inset-0 z-0">
            <Suspense fallback={null}>
                <AnimatedBackground />
            </Suspense>
        </div>
    );
};

export default background3d;