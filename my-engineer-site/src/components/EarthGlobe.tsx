// src/components/EarthGlobe.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

const MY_LOCATION = { lat: 33.1972, lon: -96.6326 };

// Convert lat/lon to 3D vector on sphere
const latLonToVector3 = (lat: number, lon: number, radius: number = 5): THREE.Vector3 => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const Marker = ({ getPosition, color }: { 
  getPosition: () => THREE.Vector3; 
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(getPosition());
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
  });
  return (
    <mesh ref={meshRef}>
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
        <bufferAttribute args={[new Float32Array(points), 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#ff00ff" transparent opacity={0.7} />
    </line>
  );
};
const TextLabel = ({ 
  getPosition, 
  children, 
  color = "white", 
  fontSize = 0.3 
}: { 
  getPosition: () => THREE.Vector3; 
  children: string; 
  color?: string; 
  fontSize?: number; 
}) => {
  const textRef = useRef<any>(null); // drei Text ref

  useFrame(() => {
    if (textRef.current) {
      const pos = getPosition();
      textRef.current.position.copy(pos);
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
};

const RotatingEarth = ({ userLocation, earthRef }: { 
  userLocation: { lat: number; lon: number } | null;
  earthRef: React.RefObject<THREE.Mesh | null>;
}) => {
  const [earthTexture, cloudTexture] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  ]);

  const cloudRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef(0);

  const myBasePos = useMemo(() => latLonToVector3(MY_LOCATION.lat, MY_LOCATION.lon, 5), []);
  const userBasePos = useMemo(() => 
    userLocation ? latLonToVector3(userLocation.lat, userLocation.lon, 5) : null, 
    [userLocation]
  );

  // Store current positions in refs
  const myPosRef = useRef<THREE.Vector3>(myBasePos.clone());
  const userPosRef = useRef<THREE.Vector3 | null>(userBasePos?.clone() || null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const rotation = t * 0.02;
    rotationRef.current = rotation;

    if (earthRef.current) earthRef.current.rotation.y = rotation;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.025;

    // Update rotated positions
    const rotate = (vec: THREE.Vector3) => {
      const v = vec.clone();
      v.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      return v.multiplyScalar(5.05 / 5);
    };

    myPosRef.current = rotate(myBasePos);
    if (userBasePos) userPosRef.current = rotate(userBasePos);
  });

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

      <Marker getPosition={() => myPosRef.current} color="#00f0ff" />
      <TextLabel 
        getPosition={() => new THREE.Vector3(
          myPosRef.current.x, 
          myPosRef.current.y + 0.4, 
          myPosRef.current.z
        )} 
        color="#00f0ff"
      >
        You
      </TextLabel>

      {userPosRef.current && (
        <>
          <Marker getPosition={() => userPosRef.current!} color="#ff00ff" />
          <TextLabel 
            getPosition={() => new THREE.Vector3(
              userPosRef.current!.x,   
              userPosRef.current!.y + 0.4, 
              userPosRef.current!.z    
            )} 
            color="#ff00ff"            
          >
            Visitor                    
          </TextLabel>
          <ConnectionArc start={myPosRef.current} end={userPosRef.current} />
        </>
      )}
    </>
  );
};

const AutoCameraFraming = ({ 
  userLocation, 
  enabled 
}: { 
  userLocation: { lat: number; lon: number } | null;
  enabled: boolean;
}) => {
  const myBasePos = useMemo(() => latLonToVector3(MY_LOCATION.lat, MY_LOCATION.lon, 5), []);
  const userBasePos = useMemo(() => 
    userLocation ? latLonToVector3(userLocation.lat, userLocation.lon, 5) : null, 
    [userLocation]
  );

  useFrame(({ camera, clock }) => {
    if (!enabled) return;

    const t = clock.getElapsedTime();
    const earthRotation = t * 0.02;

    // Rotate base positions
    const rotateVec = (vec: THREE.Vector3) => {
      const v = vec.clone();
      v.applyAxisAngle(new THREE.Vector3(0, 1, 0), earthRotation);
      return v;
    };

    const myPos = rotateVec(myBasePos);
    const userPos = userBasePos ? rotateVec(userBasePos) : null;

    // Midpoint between points
    const target = userPos 
      ? new THREE.Vector3().addVectors(myPos, userPos).multiplyScalar(0.5)
      : myPos;

    // Position camera to frame both points
    const distance = userPos 
      ? myPos.distanceTo(userPos) * 3 + 10 
      : 15;

    // Orbit around Y-axis while looking at target
    const angle = earthRotation;
    camera.position.x = target.x + Math.sin(angle) * distance;
    camera.position.z = target.z + Math.cos(angle) * distance;
    camera.position.y = target.y + 2;
    camera.lookAt(target);
  });

  return null;
};

const RotatingStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
    />
  );
};

const EarthGlobe = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geolocationError, setGeolocationError] = useState(false);
  const controlsRef = useRef<any>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleInteraction = () => {
    setAutoRotate(false);
  };

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
      <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <RotatingStars />
        
        <RotatingEarth userLocation={userLocation} earthRef={earthRef} />
        
        {autoRotate && (
          <AutoCameraFraming userLocation={userLocation} enabled={autoRotate} />
        )}
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={7}
          maxDistance={30}
          onStart={handleInteraction}
          onChange={handleInteraction}
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