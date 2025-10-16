import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const latLonToVector3 = (lat: number, lon: number, radius: number = 5): THREE.Vector3 => {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
};

const MCKINNEY_POS = latLonToVector3(33.1972, -96.6326, 5.1);

const Earth = () => {
    const earthRef = useRef<THREE.Mesh>(null);
    const markerRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
        if (markerRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
            markerRef.current.scale.setScalar(scale);
        }
    });

    return (
        <>
        <mesh ref={earthRef}>
            <sphereGeometry args={[5, 64, 64]} />
            <meshPhongMaterial
                color="#1a3d6d"
                specular="#333"
                shininess={5}
                transparent 
                opacity={0.9}
            />
        </mesh>

        <mesh position={MCKINNEY_POS} ref={markerRef}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>

        <Text
            position={[MCKINNEY_POS.x, MCKINNEY_POS.y + 0.5, MCKINNEY_POS.z]}
            fontSize={0.3}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
        >
            McKinney, TX
        </Text>
        </>
    );
};

const EarthGlobe = () => {
    return (
        <div className="w-full h-screen fixed top-0 left-0 z-0">
            <Canvas camera={{ position:[0, 0, 15], fov: 60}}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} />
                <Earth />
                <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    autoRotate={false}
                    minDistance={8}
                    maxDistance={30}
                />
            </Canvas>
        </div>
    );
};

export default EarthGlobe;
