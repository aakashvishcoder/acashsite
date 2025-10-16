import { useState, useEffect, useRef } from 'react';
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

const MY_LOCATION = { lat: 33.1972, lon: -96.6326 }

const Marker = ({ position, color } : { position: THREE.Vector3, color: string}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.15;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh position={position} ref={meshRef}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
    );
};

const Earth = ({ userLocation }: { userLocation: { lat: number; lon: number } | null}) => {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);

    const [earthTexture, cloudTexture] = useTexture([
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
    ]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) earthRef.current.rotation.y = t * 0.01;
        if (cloudRef.current) cloudRef.current.rotation.y = t * 0.015;
    });

    const myPos = latLonToVector3(MY_LOCATION.lat, MY_LOCATION.lon, 5.05);
    const userPos = userLocation
        ? latLonToVector3(userLocation.lat, userLocation.lon, 5.05)
        : null;
    
    return (
        <>
            <mesh ref={earthRef}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshPhongMaterial map={earthTexture} specular="#333" shininess={5} />
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

            <Marker position={myPos} color="#00f0ff" />
            { userPos && <Marker position={userPos} color={'#ff00ff'} />}
        </>
    );
};

const EarthGlobe = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [geolocationError, setGeolocationError] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Geolocation denied or unavailable:', error);
                    setGeolocationError(true);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000, 
                    maximumAge: 300000,
                }
            );
        } else {
            setGeolocationError(true);
        }
    }, []);

    return (
        <div className="w-full h-screen fixed top-0 left-0 z-0">
            <Canvas camera={{ position: [0,0,15], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} />
                <Earth userLocation={userLocation} />
                <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={7}
                    maxDistance={30}
                    autoRotate={false}
                />
            </Canvas>

            {geolocationError && !userLocation && (
                <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/40 px-2 py-1 rounded">
                    Location access denied or unavailable
                </div>
            )}
        </div>
    );
};

export default EarthGlobe;