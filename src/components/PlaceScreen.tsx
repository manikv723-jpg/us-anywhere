import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { CardData } from './Card';

export default function PlaceScreen({ card, onClose }: { card: CardData; onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[#0B0A0A]/95 px-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClose}
    >
      <motion.div
        className="flex w-full max-w-sm flex-col items-center"
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {card.image && (
          <img src={card.image} alt={card.city} className="aspect-[3/4] w-full object-cover" />
        )}
        <h2 className="font-display mt-7 text-[30px] font-light lowercase text-white">{card.city}</h2>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-white/55">{card.caption}</p>

        <button
          onClick={onClose}
          className="mt-9 flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-white/40 transition-colors hover:text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          back to us
        </button>
      </motion.div>
    </motion.div>
  );
}
