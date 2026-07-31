import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFibonacciSphere } from '../utils/math';
import { GLOBE_RADIUS, TOTAL_POSITIONS } from '../story';
import Card, { CardData } from './Card';

interface GlobeProps {
  cards: CardData[];
  rotationState: React.MutableRefObject<{ x: number; y: number }>;
  velocityState: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  lastInteraction: React.MutableRefObject<number>;
  recording: React.MutableRefObject<boolean>;
  onSelect: (card: CardData) => void;
  onHover?: (city: string) => void;
  onHoverOut?: () => void;
}

// One clean revolution over ten seconds at 60fps, for the shareable clip.
const RECORD_SPIN = (Math.PI * 2) / 600;

export default function Globe({
  cards, rotationState, velocityState, isDragging, lastInteraction, recording, onSelect, onHover, onHoverOut,
}: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const layout = useMemo(() => {
    const positions = generateFibonacciSphere(TOTAL_POSITIONS, GLOBE_RADIUS);
    return positions.map((pos, i) => ({
      position: pos,
      scale: 0.75 + ((i * 37) % 11) / 22, // deterministic 0.75–1.25 spread
      cardIndex: i,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // While recording, take over completely so the clip loops seamlessly.
    if (recording.current) {
      rotationState.current.x *= 0.9;
      rotationState.current.y += RECORD_SPIN;
      groupRef.current.rotation.x = rotationState.current.x;
      groupRef.current.rotation.y = rotationState.current.y;
      return;
    }

    rotationState.current.x += velocityState.current.x;
    rotationState.current.y += velocityState.current.y;

    // Limit pitch to prevent gimbal lock or uncomfortable viewing
    rotationState.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationState.current.x));

    if (!isDragging.current) {
      velocityState.current.x *= 0.92;
      velocityState.current.y *= 0.92;

      // Ambient idle rotation, gently reintroduced after the user lets go
      if (Date.now() - lastInteraction.current > 2000) {
        velocityState.current.y += 0.00015;
      }
    } else {
      velocityState.current.x *= 0.3;
      velocityState.current.y *= 0.3;
    }

    groupRef.current.rotation.x = rotationState.current.x;
    groupRef.current.rotation.y = rotationState.current.y;
  });

  if (!cards.length) return null;

  return (
    <group ref={groupRef}>
      {layout.map((slot, i) => (
        <Card
          key={i}
          // Stride of 5 is coprime with 12, so neighbouring positions on the
          // sphere never land on the same photo twice in a row.
          data={cards[(slot.cardIndex * 5) % cards.length]}
          position={slot.position}
          scale={slot.scale}
          onSelect={(card) => {
            if (!isDragging.current && !recording.current) onSelect(card);
          }}
          onHover={onHover}
          onHoverOut={onHoverOut}
        />
      ))}
    </group>
  );
}
