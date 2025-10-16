import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const latLonToVector3 = (lat: number, lon: number, radius: number = 5): THREE.Vector3 => {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi)* Math.sin(theta)
    );
};

const MCKINNEY_POS = latLonToVector3(33.1972, -96.6326, 5.05);

const Earth = () => {
    const earthRef = useRef<THREE.Mesh>(null);
    const markerRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);

    const [earthTexture, cloudTexture] = useTexture([
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
    ]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) {
            earthRef.current.rotation.y = t * 0.01; //auto-rotate
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y = t * 0.015;
        }
        if (markerRef.current) {
            const scale = 1 + Math.sin(t * 4) * 0.1;
            markerRef.current.scale.setScalar(scale);
        }
    });

    return (
        <>
            <mesh ref={earthRef}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshPhongMaterial map={earthTexture} specular='#333' shininess={5} />
            </mesh>

            <mesh ref={cloudRef} renderOrder={1}>
                <sphereGeometry args={[5.02, 64, 64]} />
                <meshPhongMaterial
                    map={cloudTexture}
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                />
            </mesh>

            <mesh position={MCKINNEY_POS} ref={markerRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
            </mesh>
        </>
    );
};

const EarthGlobe = () => {
    return (
        <div className="w-full h-screen fixed top-0 left-0 z-0">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} />
                <Earth />
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={7}
                    maxDistance={30}
                    autoRotate={true} //toggle true or false to enable/disable autorotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default EarthGlobe;