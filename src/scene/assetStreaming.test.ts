import { beforeEach, describe, expect, it } from 'vitest';
import { STREAM_ORDER, useAssetStreaming } from './assetStreaming';

describe('background model queue', () => {
  beforeEach(() => useAssetStreaming.setState({ started: false, status: {} }));
  it('waits for entry and limits background work to two different models', () => {
    expect(useAssetStreaming.getState().status).toEqual({});
    useAssetStreaming.getState().start();
    expect(Object.keys(useAssetStreaming.getState().status)).toEqual(STREAM_ORDER.slice(0,2));
    useAssetStreaming.getState().start();
    expect(Object.keys(useAssetStreaming.getState().status)).toHaveLength(2);
  });
  it('advances past a failed resource and counts duplicate instances only once', () => {
    useAssetStreaming.getState().start();
    useAssetStreaming.getState().finish(STREAM_ORDER[0], true);
    useAssetStreaming.getState().finish(STREAM_ORDER[0]);
    const {status} = useAssetStreaming.getState();
    expect(status[STREAM_ORDER[0]]).toBe('failed');
    expect(status[STREAM_ORDER[2]]).toBe('loading');
    expect(Object.values(status).filter(s => s === 'loading')).toHaveLength(2);
  });
});
