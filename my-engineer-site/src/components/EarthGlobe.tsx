import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

const MY_LOCATION = { lat: 33.1972, lon: -96.6326 };

const latLonToVector3 = (lat: number, lon: number, radius: number = 5): THREE.Vector3 => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const Marker = ({ getPosition, color, onContextMenu }: { 
  getPosition: () => THREE.Vector3; 
  color: string;
  onContextMenu?: () => void;
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
    <mesh 
      ref={meshRef}
      onContextMenu={(e) => {
        e.stopPropagation();
        onContextMenu?.();
      }}
    >
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
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
  const textRef = useRef<any>(null);
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

const UserPin = ({ 
  pin, 
  onDelete 
}: { 
  pin: { id: string; lat: number; lon: number; label: string; color: string }; 
  onDelete: () => void;
}) => {
  const basePosRef = useRef<THREE.Vector3>(latLonToVector3(pin.lat, pin.lon, 5));
  const posRef = useRef<THREE.Vector3>(basePosRef.current.clone());

  useFrame(({ clock }) => {
    const rotation = clock.getElapsedTime() * 0.02;
    const v = basePosRef.current.clone();
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    posRef.current = v.multiplyScalar(5.05 / 5);
  });

  return (
    <>
      <Marker 
        getPosition={() => posRef.current} 
        color={pin.color} 
        onContextMenu={onDelete}
      />
      <TextLabel 
        getPosition={() => new THREE.Vector3(
          posRef.current.x,
          posRef.current.y + 0.4,
          posRef.current.z
        )}
        color={pin.color}
        fontSize={0.25}
      >
        {pin.label}
      </TextLabel>
    </>
  );
};

const RotatingEarth = ({ 
  userPins,
  onDeletePin,
}: { 
  userPins: { id: string; lat: number; lon: number; label: string; color: string }[];
  onDeletePin: (id: string) => void;
}) => {
  const [earthTexture, cloudTexture] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  ]);

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const myBasePos = useMemo(() => latLonToVector3(MY_LOCATION.lat, MY_LOCATION.lon, 5), []);
  const myPosRef = useRef<THREE.Vector3>(myBasePos.clone());

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const rotation = t * 0.02;
    if (earthRef.current) earthRef.current.rotation.y = rotation;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.025;

    const v = myBasePos.clone();
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    myPosRef.current = v.multiplyScalar(5.05 / 5);
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
        Aakash
      </TextLabel>

      {userPins.map(pin => (
        <UserPin key={pin.id} pin={pin} onDelete={() => onDeletePin(pin.id)} />
      ))}
    </>
  );
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

const PinFormModal = ({
  isOpen,
  onClose,
  onAddPin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddPin: (label: string, color: string, lat: number, lon: number) => void;
}) => {
  const [label, setLabel] = useState('My Place');
  const [color, setColor] = useState('#ff5733');
  const [lat, setLat] = useState<string>('0');
  const [lon, setLon] = useState<string>('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) {
      alert('Please enter valid numbers for latitude and longitude.');
      return;
    }
    if (latNum < -90 || latNum > 90) {
      alert('Latitude must be between -90 and 90.');
      return;
    }
    if (lonNum < -180 || lonNum > 180) {
      alert('Longitude must be between -180 and 180.');
      return;
    }
    onAddPin(label, color, latNum, lonNum);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">📍 Add a Custom Pin</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Home, Paris ✈️"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Latitude (°)</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 33.1972"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Longitude (°)</label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., -96.6326"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded border border-gray-600"
              />
              <span className="text-gray-400 text-sm">{color}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded font-medium transition"
            >
              Add Pin
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EarthGlobe = () => {
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const sceneRef = useRef<THREE.Group>(null);
  const [pinToDelete, setPinToDelete] = useState<{ id: string; label: string } | null>(null);
  const [userPins, setUserPins] = useState<
    { id: string; lat: number; lon: number; label: string; color: string }[]
  >([]);
  const [justAddedPin, setJustAddedPin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddPin = (label: string, color: string, lat: number, lon: number) => {
    setUserPins((prev) => [
      ...prev,
      { id: uuidv4(), lat, lon, label, color },
    ]);
    setJustAddedPin(true);
    setTimeout(() => setJustAddedPin(false), 300);
  };

  const handleDeletePin = (id: string, label: string) => {
    setPinToDelete({ id, label });
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-auto">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center bg-black/50 text-cyan-300 text-xs md:text-sm px-4 py-2 rounded-xl shadow-lg backdrop-blur-md border border-cyan-500/30">
        🌍 Click the globe to add a pin • Right-click pins to delete
      </div>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 60 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
        onPointerDown={(e) => {
          pointerDownPos.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (!pointerDownPos.current || !sceneRef.current || !cameraRef.current) return;
          const dx = e.clientX - pointerDownPos.current.x;
          const dy = e.clientY - pointerDownPos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 6) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, cameraRef.current);
            const intersects = raycaster.intersectObjects(sceneRef.current.children, false);
            if (intersects.length > 0) {
              setIsModalOpen(true);
            }
          }
          pointerDownPos.current = null;
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <group ref={sceneRef}>
          <RotatingStars />
          <RotatingEarth 
            userPins={userPins}
            onDeletePin={(id) => {
              const pin = userPins.find(p => p.id === id);
              if (pin) {
                handleDeletePin(id, pin.label);
              }
            }}
          />
        </group>
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={7}
          maxDistance={30}
        />
      </Canvas>

      <PinFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPin={handleAddPin}
      />

      {pinToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Delete Pin?</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "<span className="text-cyan-300">{pinToDelete.label}</span>"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUserPins(pins => pins.filter(p => p.id !== pinToDelete.id));
                  setPinToDelete(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded font-medium transition"
              >
                Delete
              </button>
              <button
                onClick={() => setPinToDelete(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthGlobe;