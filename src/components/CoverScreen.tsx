import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface CoverScreenProps {
  hero: string;
  names: { a: string; b: string };
  message: string;
  ready: number;
  total: number;
  onOpen: () => void;
}

export default function CoverScreen({ hero, names, message, ready, total, onOpen }: CoverScreenProps) {
  const startY = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  const armed = ready > 0;

  const release = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (drag > 70 && armed) onOpen();
    else setDrag(0);
  };

  return (
    <motion.div
      className="absolute inset-0 select-none touch-none overflow-hidden bg-black"
      onPointerDown={(e) => { startY.current = e.clientY; }}
      onPointerMove={(e) => {
        if (startY.current === null) return;
        setDrag(Math.max(0, startY.current - e.clientY));
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onClick={() => armed && drag === 0 && onOpen()}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The photo they uploaded — the first thing their person sees. */}
      <motion.img
        src={hero}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1 + drag * 0.0004, opacity: 1 }}
        transition={{ opacity: { duration: 1.4 }, scale: { duration: 0.1 } }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-14 text-center"
        style={{ transform: `translateY(${-drag * 0.35}px)` }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mb-5 text-[10px] uppercase tracking-[0.42em] text-white/55">
          {names.a} &amp; {names.b}
        </p>

        <h1 className="font-display max-w-[300px] text-[34px] leading-[1.12] font-light lowercase text-white sm:max-w-[440px] sm:text-[48px]">
          {message}
        </h1>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: armed ? [0, -9, 0] : 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronUp className="h-5 w-5 text-white/70" strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/45">
            {armed ? 'swipe up' : `${ready} of ${total}`}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
