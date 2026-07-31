import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../story';
import Globe from './Globe';
import { CardData } from './Card';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const DEFAULT_CAMERA_Z = isMobile ? 20.2 : 13.9;

function CameraController({ targetZ }: { targetZ: React.MutableRefObject<number> }) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ.current, 0.05);
  });
  return null;
}

interface GalleryGlobeProps {
  cards: CardData[];
  recording: React.MutableRefObject<boolean>;
  onSelect: (card: CardData) => void;
}

export default function GalleryGlobe({ cards, recording, onSelect }: GalleryGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const targetZ = useRef(DEFAULT_CAMERA_Z);
  const rotationState = useRef({ x: 0, y: 0 });
  const velocityState = useRef({ x: 0, y: 0.002 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(Date.now() - 3000);
  const pointerPos = useRef({ x: 0, y: 0 });

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Non-passive so pinch and scroll are captured reliably outside React
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (recording.current) return;
      lastInteractionTime.current = Date.now();
      targetZ.current += e.deltaY * 0.015;
      // Clamped so you can fly through the middle but not escape into the void
      targetZ.current = Math.max(-GLOBE_RADIUS * 0.8, Math.min(isMobile ? 26 : 21, targetZ.current));
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [recording]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (recording.current) return;
    isDragging.current = true;
    setIsMouseDown(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
    lastInteractionTime.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
    }
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    velocityState.current.y += deltaX * 0.005;
    velocityState.current.x += deltaY * 0.005;
    lastInteractionTime.current = Date.now();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsMouseDown(false);
    lastInteractionTime.current = Date.now();
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 45, near: 0.1 }}
        // Required so the canvas can be read back for the shareable clip
        gl={{ preserveDrawingBuffer: true }}
      >
        <CameraController targetZ={targetZ} />
        <Suspense fallback={null}>
          <Globe
            cards={cards}
            rotationState={rotationState}
            velocityState={velocityState}
            isDragging={isDragging}
            lastInteraction={lastInteractionTime}
            recording={recording}
            onSelect={onSelect}
            onHover={(city) => setTooltip(city)}
            onHoverOut={() => setTooltip(null)}
          />
        </Suspense>
      </Canvas>

      {tooltip && !recording.current && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed left-0 top-0 z-50 whitespace-nowrap rounded-full bg-black px-4 py-2 font-sans text-sm font-medium text-white shadow-xl"
          style={{
            willChange: 'transform',
            transform: `translate(${pointerPos.current.x + 16}px, ${pointerPos.current.y + 16}px)`,
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
