import { useEffect, useState } from 'react';
import { useGame } from '../app/store';
import { hotspots } from '../content/data';

export default function MemoryCard() {
  const openId = useGame((s) => s.openHotspot);
  const phase = useGame((s) => s.phase);
  const setOpenHotspot = useGame((s) => s.setOpenHotspot);
  const [shown, setShown] = useState(false); // 控制滑入动画
  const hotspot = hotspots.find((h) => h.id === openId);

  useEffect(() => {
    if (openId) {
      const timer = setTimeout(() => setShown(true), 380); // 动效先行 400ms 再出卡
      return () => clearTimeout(timer);
    }
    setShown(false);
  }, [openId]);

  if (!hotspot || phase === 'title') return null;

  return (
    <div
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          width: 'min(92vw, 480px)', margin: '0 auto 24px',
          background: 'rgba(253, 250, 242, 0.96)',
          borderRadius: 18, padding: '18px 20px 20px',
          boxShadow: '0 8px 32px rgba(60, 40, 20, 0.25)',
          transform: shown ? 'translateY(0)' : 'translateY(110%)',
          opacity: shown ? 1 : 0,
          transition: 'transform 380ms cubic-bezier(.2,.8,.3,1), opacity 300ms',
          pointerEvents: 'auto',
        }}
      >
        {hotspot.memory?.photo && (
          <img
            src={`content/photos/${hotspot.memory.photo}`}
            style={{ width: '100%', borderRadius: 12, display: 'block', marginBottom: 12 }}
            alt={hotspot.memory.title}
          />
        )}
        <h2 style={{ margin: '0 0 8px', fontSize: 22, color: '#4a3728' }}>
          {hotspot.memory?.title ?? hotspot.label}
        </h2>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: '#5c4a38', whiteSpace: 'pre-wrap' }}>
          {hotspot.memory?.text ?? '（这段回忆还没写好）'}
        </p>
        <button
          onClick={() => setOpenHotspot(null)}
          style={{
            marginTop: 16, width: '100%', padding: '12px 0', fontSize: 18,
            border: 'none', borderRadius: 12, background: '#c9a06a', color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          合上回忆
        </button>
      </div>
    </div>
  );
}