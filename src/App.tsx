import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import GalleryGlobe from './components/GalleryGlobe';
import CoverScreen from './components/CoverScreen';
import PlaceScreen from './components/PlaceScreen';
import { CardData } from './components/Card';
import { PLACES } from './story';
import { buildCollage, canRecord, recordGlobe, shareFiles } from './utils/share';

interface Config {
  names: { a: string; b: string };
  message: string;
}

const DEFAULT_CONFIG: Config = {
  names: { a: 'You', b: 'Me' },
  message: 'swipe to see our world together',
};

type ShareState = 'idle' | 'recording' | 'building' | 'shared' | 'downloaded';

/** Resolves once we know whether the real photos exist yet. */
function probe(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function App() {
  const [config, setConfig] = useState<Config | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [demo, setDemo] = useState(false);
  // ?open=1 skips the cover — handy when filming the globe itself
  const [opened, setOpened] = useState(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('open')
  );
  const [selected, setSelected] = useState<CardData | null>(null);
  const [shareState, setShareState] = useState<ShareState>('idle');
  const recording = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const cfg: Config = await fetch('/config.json')
        .then((r) => (r.ok ? r.json() : DEFAULT_CONFIG))
        .catch(() => DEFAULT_CONFIG);

      // Photos live at a fixed path by convention: /generated/0.png … 11.png.
      // No manifest, no API — if the files are there, they get used.
      const hasReal = await probe('/generated/0.png');
      if (!alive) return;

      setConfig({ ...DEFAULT_CONFIG, ...cfg });
      setDemo(!hasReal);
      setCards(
        PLACES.map((p, i) => ({
          index: i,
          city: p.city,
          caption: p.caption,
          image: hasReal ? `/generated/${i}.png` : `https://picsum.photos/seed/usanywhere${i}/600/800`,
        }))
      );
    })();

    return () => { alive = false; };
  }, []);

  const share = async () => {
    if (!config || shareState === 'recording' || shareState === 'building') return;
    const canvas = document.querySelector('canvas');
    const files: File[] = [];

    if (canvas && canRecord()) {
      setShareState('recording');
      recording.current = true;
      const video = await recordGlobe(canvas as HTMLCanvasElement, 10000);
      recording.current = false;
      if (video) files.push(video);
    }

    setShareState('building');
    const collage = await buildCollage(cards, config.names);
    if (collage) files.push(collage);

    if (!files.length) { setShareState('idle'); return; }
    const how = await shareFiles(files, `our world together 💗 — ${config.names.a} & ${config.names.b}`);
    setShareState(how);
    setTimeout(() => setShareState('idle'), 6000);
  };

  const shareLabel = {
    idle: 'send this to your person',
    recording: 'capturing our world…',
    building: 'almost there…',
    shared: 'sent 💗',
    downloaded: 'saved — now send it to them 💗',
  }[shareState];

  const busy = shareState === 'recording' || shareState === 'building';

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0B0A0A]">
      <AnimatePresence>
        {!opened && config && (
          <CoverScreen
            key="cover"
            hero="/us.jpg"
            names={config.names}
            message={config.message}
            ready={cards.length}
            total={PLACES.length}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      {opened && (
        <>
          <motion.div
            className={`absolute inset-0 ${selected ? 'pointer-events-none' : ''}`}
            initial={{ scale: 1.25, opacity: 0 }}
            animate={{ scale: selected ? 0.85 : 1, opacity: selected ? 0.25 : 1 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <GalleryGlobe cards={cards} recording={recording} onSelect={setSelected} />
          </motion.div>

          <AnimatePresence>
            {selected && <PlaceScreen key="place" card={selected} onClose={() => setSelected(null)} />}
          </AnimatePresence>

          {!selected && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 pb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
            >
              <button
                onClick={share}
                disabled={busy || !cards.length}
                className="flex items-center gap-2.5 rounded-full bg-[#E8B4B8] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#0B0A0A] transition-opacity disabled:opacity-60"
              >
                <Heart className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                {shareLabel}
              </button>
              {demo && (
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  demo photos — add yours to /generated
                </span>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
