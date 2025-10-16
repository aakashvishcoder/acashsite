// src/components/EarthGlobe.tsx
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Text } from '@react-three/drei';
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

const MY_LOCATION = { lat: 33.1972, lon: -96.6326 };

const Marker = ({ position, color }: { position: THREE.Vector3; color: string }) => {
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
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const ConnectionArc = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const points: number[] = [];
  const radius = 5.15;
  const startNorm = start.clone().normalize();
  const endNorm = end.clone().normalize();
  const segments = 32;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const interpolated = startNorm.clone().lerp(endNorm, t).normalize().multiplyScalar(radius);
    points.push(interpolated.x, interpolated.y, interpolated.z);
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ff00ff" transparent opacity={0.7} />
    </line>
  );
};

const Earth = ({ userLocation }: { userLocation: { lat: number; lon: number } | null }) => {
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
      <Text position={[myPos.x, myPos.y + 0.4, myPos.z]} fontSize={0.3} color="#00f0ff" anchorX="center" anchorY="middle">
        Aakash
      </Text>

      {userPos && (
        <>
          <Marker position={userPos} color="#ff00ff" />
          <Text position={[userPos.x, userPos.y + 0.4, userPos.z]} fontSize={0.3} color="#ff00ff" anchorX="center" anchorY="middle">
            Visitor
          </Text>
          <ConnectionArc start={myPos} end={userPos} />
        </>
      )}
    </>
  );
};

const EarthGlobe = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
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
        () => setGeolocationError(true),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setGeolocationError(true);
    }
  }, []);

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
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
          Location access needed for "Visitor" marker
        </div>
      )}
    </div>
  );
};

export default EarthGlobe;