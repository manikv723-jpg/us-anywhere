import { CardData } from '../components/Card';

// Safari and Chrome disagree on what they will actually encode. Ask for mp4
// first (WhatsApp/Instagram accept it everywhere), fall back to webm.
function pickMimeType(): string | undefined {
  const candidates = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  if (typeof MediaRecorder === 'undefined') return undefined;
  return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

export function canRecord(): boolean {
  return typeof MediaRecorder !== 'undefined' && !!pickMimeType();
}

export async function recordGlobe(canvas: HTMLCanvasElement, ms = 10000): Promise<File | null> {
  const mimeType = pickMimeType();
  if (!mimeType) return null;

  const stream = canvas.captureStream(30);
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });

  return new Promise((resolve) => {
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
      resolve(new File([blob], `our-world.${ext}`, { type: blob.type }));
    };
    recorder.onerror = () => resolve(null);
    recorder.start();
    setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), ms);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// 3x4 grid at 1080x1350 — Instagram portrait, and the fallback that renders
// on literally any device even when video sharing is unavailable.
export async function buildCollage(cards: CardData[], names: { a: string; b: string }): Promise<File | null> {
  const W = 1080;
  const H = 1350;
  const COLS = 3;
  const ROWS = 4;
  const PAD = 24;
  const FOOTER = 132;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0B0A0A';
  ctx.fillRect(0, 0, W, H);

  const cellW = (W - PAD * (COLS + 1)) / COLS;
  const cellH = (H - FOOTER - PAD * (ROWS + 1)) / ROWS;

  const usable = cards.filter((c) => c.image).slice(0, COLS * ROWS);
  await Promise.all(
    usable.map(async (card, i) => {
      try {
        const img = await loadImage(card.image!);
        const x = PAD + (i % COLS) * (cellW + PAD);
        const y = PAD + Math.floor(i / COLS) * (cellH + PAD);

        // Center-crop to fill the cell without squashing anyone
        const scale = Math.max(cellW / img.width, cellH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cellW, cellH);
        ctx.clip();
        ctx.drawImage(img, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
        ctx.restore();
      } catch {
        /* a missing image just leaves that cell dark */
      }
    })
  );

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '300 44px Georgia, serif';
  ctx.fillText('us, anywhere', W / 2, H - FOOTER / 2 - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '400 20px Helvetica, Arial, sans-serif';
  ctx.fillText(`${names.a.toUpperCase()}  &  ${names.b.toUpperCase()}`, W / 2, H - FOOTER / 2 + 34);

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
  if (!blob) return null;
  return new File([blob], 'our-world.jpg', { type: 'image/jpeg' });
}

function download(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Returns how the files actually reached the user, so the UI can say the right thing. */
export async function shareFiles(files: File[], text: string): Promise<'shared' | 'downloaded'> {
  const usable = files.filter(Boolean);

  if (navigator.canShare?.({ files: usable })) {
    try {
      await navigator.share({ files: usable, text });
      return 'shared';
    } catch (e: any) {
      // A user hitting cancel is not a failure worth falling back on
      if (e?.name === 'AbortError') return 'shared';
    }
  }

  usable.forEach(download);
  return 'downloaded';
}
