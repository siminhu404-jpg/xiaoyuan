import { useGame } from '../app/store';

// 桌面（有精细指针）才提示键盘操作；移动端保持原副标题不变
const hasKeyboard = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

export default function TitleScreen() {
  const phase = useGame((s) => s.phase);
  const setPhase = useGame((s) => s.setPhase);
  if (phase !== 'title') return null;
  return (
    <div
      onClick={() => setPhase('intro')}
      style={{
        position: 'fixed', inset: 0, zIndex: 30, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #a4c8e8 0%, #f4e4c1 100%)',
        color: '#4a3728', userSelect: 'none',
      }}
    >
      <h1 style={{ fontSize: 'min(13vw, 72px)', margin: 0, letterSpacing: '0.12em', fontWeight: 700 }}>
        姥姥家的小院
      </h1>
      <p style={{ fontSize: 'min(4.5vw, 20px)', opacity: 0.75, margin: '16px 0 48px' }}>
        夏天午后 · 点哪儿，人就走哪儿{hasKeyboard ? ' · 也可以用 WASD' : ''}
      </p>
      <div
        style={{
          fontSize: 'min(5vw, 24px)', padding: '14px 44px', borderRadius: 999,
          background: '#c9a06a', color: '#fff', boxShadow: '0 6px 24px rgba(120,80,40,.35)',
        }}
      >
        推门进院
      </div>
    </div>
  );
}