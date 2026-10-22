export default function LoadingHint() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 40, background: '#f4e4c1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8a6f52', fontSize: 20, letterSpacing: '0.2em',
      }}
    >
      正在推开院门 ...
    </div>
  );
}