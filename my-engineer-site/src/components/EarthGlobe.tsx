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

      <Marker getPosition={() => myPosRef.current} color="#4dff9f" />
      <TextLabel 
        getPosition={() => new THREE.Vector3(
          myPosRef.current.x, 
          myPosRef.current.y + 0.4, 
          myPosRef.current.z
        )} 
        color="#4dff9f"
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
  const [color, setColor] = useState('#ffb454');
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
    <div className="fixed inset-0 bg-board-900/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="term-panel fiducial w-full max-w-md p-6">
        <h3 className="font-display text-3xl text-phos glow leading-none mb-1">new_pin</h3>
        <p className="font-mono text-xs text-phos-dim prompt mb-4">insert --lat --lon</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-tech text-[10px] uppercase tracking-[0.2em] text-phos-dim mb-1.5">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-board-900 border border-etch rounded-term px-3 py-2 font-mono text-sm text-phos placeholder:text-etch-bright focus:outline-none focus:border-phos-dim focus:shadow-glow-sm transition"
              placeholder="e.g., Home, Paris ✈️"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block font-tech text-[10px] uppercase tracking-[0.2em] text-phos-dim mb-1.5">Latitude (°)</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full bg-board-900 border border-etch rounded-term px-3 py-2 font-mono text-sm text-phos placeholder:text-etch-bright focus:outline-none focus:border-phos-dim focus:shadow-glow-sm transition"
              placeholder="e.g., 33.1972"
            />
          </div>
          <div className="mb-4">
            <label className="block font-tech text-[10px] uppercase tracking-[0.2em] text-phos-dim mb-1.5">Longitude (°)</label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full bg-board-900 border border-etch rounded-term px-3 py-2 font-mono text-sm text-phos placeholder:text-etch-bright focus:outline-none focus:border-phos-dim focus:shadow-glow-sm transition"
              placeholder="e.g., -96.6326"
            />
          </div>
          <div className="mb-6">
            <label className="block font-tech text-[10px] uppercase tracking-[0.2em] text-phos-dim mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded-term border border-etch bg-board-900"
              />
              <span className="font-mono text-xs text-phos-dim uppercase">{color}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="key flex-1"
            >
              Add Pin
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-etch bg-board-700 hover:bg-board-600 hover:border-etch-bright text-[#8fa89a] py-2 px-4 rounded-term font-mono text-sm tracking-wider transition"
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
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddPin = (label: string, color: string, lat: number, lon: number) => {
    setUserPins((prev) => [
      ...prev,
      { id: uuidv4(), lat, lon, label, color },
    ]);
  };

  const handleDeletePin = (id: string, label: string) => {
    setPinToDelete({ id, label });
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-auto">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 term-panel px-4 py-2 font-tech text-[11px] md:text-xs uppercase tracking-[0.16em] text-phos-dim">
        <span className="inline-block w-1.5 h-1.5 bg-phos rounded-full mr-2 align-middle animate-blip" />
        click globe &rarr; drop pin
        <span className="mx-2 text-etch-bright">|</span>
        right-click pin &rarr; erase
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
        <div className="fixed inset-0 bg-board-900/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="term-panel fiducial w-full max-w-sm p-6" style={{ borderColor: '#5c2b28' }}>
            <h3 className="font-display text-3xl text-fault leading-none mb-1">confirm</h3>
            <p className="font-mono text-xs text-fault/70 prompt mb-4">rm ./pins/{pinToDelete.label}</p>
            <p className="font-mono text-sm text-[#b8ccc0] mb-5">
              <span className="text-phos-dim select-none">&gt; </span>
              this will erase "<span className="text-phos">{pinToDelete.label}</span>" permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUserPins(pins => pins.filter(p => p.id !== pinToDelete.id));
                  setPinToDelete(null);
                }}
                className="flex-1 border border-fault/60 bg-fault/10 hover:bg-fault/20 hover:border-fault text-fault py-2 px-4 rounded-term font-mono text-sm tracking-wider transition"
              >
                Delete
              </button>
              <button
                onClick={() => setPinToDelete(null)}
                className="flex-1 border border-etch bg-board-700 hover:bg-board-600 hover:border-etch-bright text-[#8fa89a] py-2 px-4 rounded-term font-mono text-sm tracking-wider transition"
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