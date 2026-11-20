import { Component, type ReactNode } from 'react';

/** Asset/WebGL failures must not leave the visitor waiting indefinitely. */
export default class StartupBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('[courtyard] Scene loading failed', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={{ position: 'fixed', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center', background: '#f4e4c1', color: '#4a3728' }}>
        <h1>小院暂时没能打开</h1>
        <p>资源加载或画面初始化失败，请重试。</p>
        <button onClick={() => window.location.reload()} style={{ padding: 14, fontSize: 18 }}>重新加载</button>
      </div>
    );
  }
}
