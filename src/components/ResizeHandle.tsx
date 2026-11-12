import { useRef } from 'react';

export const SIDEBAR_MIN = 320;
export const SIDEBAR_MAX = 720;
export const SIDEBAR_DEFAULT = 420;
export const SIDEBAR_STORAGE_KEY = 'p-graph:sidebar-width';

const clamp = (width: number) => Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, width));

export default function ResizeHandle({ width, onResize, onResizeEnd }: {
  width: number;
  onResize: (width: number) => void;
  onResizeEnd: (width: number) => void;
}) {
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);
  const currentWidth = useRef(width);

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    document.body.classList.remove('select-none');
    onResizeEnd(currentWidth.current);
  };

  return (
    <div
      data-testid="resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="调整侧栏宽度"
      aria-valuenow={width}
      aria-valuemin={SIDEBAR_MIN}
      aria-valuemax={SIDEBAR_MAX}
      tabIndex={0}
      className="w-[6px] shrink-0 cursor-col-resize bg-transparent hover:bg-neutral-300"
      onPointerDown={(e) => {
        drag.current = { startX: e.clientX, startWidth: width };
        currentWidth.current = width;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        document.body.classList.add('select-none');
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const next = clamp(drag.current.startWidth + (drag.current.startX - e.clientX));
        currentWidth.current = next;
        onResize(next);
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(e) => {
        const next = e.key === 'ArrowLeft' ? clamp(width + 16)
          : e.key === 'ArrowRight' ? clamp(width - 16)
            : e.key === 'Home' ? SIDEBAR_MIN
              : e.key === 'End' ? SIDEBAR_MAX : null;
        if (next === null) return;
        e.preventDefault();
        currentWidth.current = next;
        onResize(next);
        onResizeEnd(next);
      }}
    />
  );
}
