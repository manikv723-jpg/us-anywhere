import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS } from '../story';

export interface CardData {
  index: number;
  city: string;
  caption: string;
  image: string | null;
}

interface CardProps {
  data: CardData;
  position: THREE.Vector3;
  scale?: number;
  onSelect: (card: CardData) => void;
  onHover?: (city: string) => void;
  onHoverOut?: () => void;
}

export default function Card({ data, position, scale = 1, onSelect, onHover, onHoverOut }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Images are already on disk by the time we get here — no generation, no API
  // call. A card is just a texture load.
  useEffect(() => {
    let active = true;

    const placeholder = document.createElement('canvas');
    placeholder.width = 400;
    placeholder.height = 500;
    const ctx = placeholder.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#EFEAE6';
      ctx.fillRect(0, 0, 400, 500);
    }
    setTexture(new THREE.CanvasTexture(placeholder));

    if (data.image) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(data.image, (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        if (active) setTexture(tex);
      });
    }

    return () => { active = false; };
  }, [data.image]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    // The local forward vector (+Z) points directly outward from center (0,0,0)
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  const geometry = useMemo(() => {
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
    const pos = geo.attributes.position;

    // Curve the plane to match the sphere's surface
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const theta = x / GLOBE_RADIUS;
      const phi = y / GLOBE_RADIUS;

      const newX = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
      const newY = GLOBE_RADIUS * Math.sin(phi);
      // Offset by GLOBE_RADIUS so its local center remains at (0,0,0)
      const newZ = GLOBE_RADIUS * Math.cos(theta) * Math.cos(phi) - GLOBE_RADIUS;

      pos.setXYZ(i, newX, newY, newZ);
    }

    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  return (
    <mesh
      position={position}
      quaternion={rotationQuaternion}
      ref={meshRef}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        if (data.image) onSelect(data);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        if (data.image) onHover?.(data.city);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onHoverOut?.();
      }}
    >
      {/* DoubleSide allows the interior views of the cards to be seen when passing through */}
      {texture && <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />}
    </mesh>
  );
}
