import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ResizeHandle, { SIDEBAR_MAX, SIDEBAR_MIN } from './ResizeHandle';

const setup = (width = 420) => {
  const onResize = vi.fn();
  const onResizeEnd = vi.fn();
  render(<ResizeHandle width={width} onResize={onResize} onResizeEnd={onResizeEnd} />);
  return { handle: screen.getByTestId('resize-handle'), onResize, onResizeEnd };
};

describe('ResizeHandle', () => {
  it('widens when dragged left and narrows when dragged right', () => {
    const { handle, onResize } = setup(420);
    fireEvent.pointerDown(handle, { clientX: 800, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 700, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(520);
    fireEvent.pointerMove(handle, { clientX: 900, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(320);
  });

  it('clamps to the allowed range', () => {
    const { handle, onResize } = setup(420);
    fireEvent.pointerDown(handle, { clientX: 800, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 0, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(SIDEBAR_MAX);
    fireEvent.pointerMove(handle, { clientX: 3000, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(SIDEBAR_MIN);
  });

  it('reports the final width on pointer up', () => {
    const { handle, onResizeEnd } = setup(420);
    fireEvent.pointerDown(handle, { clientX: 800, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 700, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 700, pointerId: 1 });
    expect(onResizeEnd).toHaveBeenLastCalledWith(520);
  });

  it('ignores pointer moves that happen before a drag starts', () => {
    const { handle, onResize } = setup(420);
    fireEvent.pointerMove(handle, { clientX: 700, pointerId: 1 });
    expect(onResize).not.toHaveBeenCalled();
  });

  it('is an accessible vertical separator', () => {
    const { handle } = setup(420);
    expect(handle).toHaveAttribute('role', 'separator');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('aria-valuenow', '420');
  });

  it('responds to arrow keys and Home/End', () => {
    const { handle, onResize, onResizeEnd } = setup(420);
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onResize).toHaveBeenLastCalledWith(436);
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onResize).toHaveBeenLastCalledWith(404);
    fireEvent.keyDown(handle, { key: 'Home' });
    expect(onResize).toHaveBeenLastCalledWith(SIDEBAR_MIN);
    fireEvent.keyDown(handle, { key: 'End' });
    expect(onResize).toHaveBeenLastCalledWith(SIDEBAR_MAX);
    expect(onResizeEnd).toHaveBeenCalled();
  });
});
