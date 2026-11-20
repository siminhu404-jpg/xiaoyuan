import { useProgress } from '@react-three/drei';
import { useGame } from '../app/store';

// 桌面（有精细指针）才提示键盘操作；移动端保持原副标题不变
const hasKeyboard = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

export default function TitleScreen({ ready = true }: { ready?: boolean }) {
  const { loaded, total } = useProgress();
  const phase = useGame((s) => s.phase);
  const setPhase = useGame((s) => s.setPhase);
  if (phase !== 'title') return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30,
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
      <button
        disabled={!ready}
        onClick={() => setPhase('play')}
        style={{
          border: 'none', fontFamily: 'inherit', cursor: ready ? 'pointer' : 'wait',
          opacity: ready ? 1 : 0.7,
          fontSize: 'min(5vw, 24px)', padding: '14px 44px', borderRadius: 999,
          background: '#c9a06a', color: '#fff', boxShadow: '0 6px 24px rgba(120,80,40,.35)',
        }}
      >
        {ready ? '推门进院' : '正在准备小院…'}
      </button>
      {!ready && <p role="status" style={{ fontSize: 15, marginTop: 18 }}>
        {total > 0 ? `已准备 ${loaded} / ${total} 项资源，首次进入请稍候` : '正在准备场景…'}
      </p>}
    </div>
  );
}