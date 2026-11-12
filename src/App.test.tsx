import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App end-to-end interaction', () => {
  it('node -> edge -> blank click walks the full selection cycle', () => {
    const { container } = render(<App />);
    expect(screen.getByText(/点节点高亮关联边/)).toBeInTheDocument();

    fireEvent.click(container.querySelector('[data-node-id="ph"]')!);
    const items = screen.getAllByTestId('edge-list-item');
    expect(items).toHaveLength(10);
    expect(container.querySelectorAll('[data-dimmed="true"]').length).toBeGreaterThan(0);

    fireEvent.click(items[0]);
    expect(screen.queryAllByTestId('edge-list-item')).toHaveLength(0);
    expect(screen.getAllByTestId('evidence-card').length).toBeGreaterThan(0);

    fireEvent.click(container.querySelector('svg')!);
    expect(screen.getByText(/点节点高亮关联边/)).toBeInTheDocument();
    expect(container.querySelectorAll('[data-dimmed="true"]')).toHaveLength(0);
  });

  it('filters the canvas down to negative edges from the panel', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(50);
    fireEvent.click(screen.getByTestId('polarity-chip-+'));
    fireEvent.click(screen.getByTestId('polarity-chip-0'));
    expect(container.querySelectorAll('[data-edge-id]')).toHaveLength(19);
    expect(screen.getByTestId('visible-count')).toHaveTextContent('19/50');
  });

  it('drops the selection when the filtered edge disappears', () => {
    const { container } = render(<App />);
    fireEvent.click(container.querySelector('[data-node-id="ph"]')!);
    const items = screen.getAllByTestId('edge-list-item');
    fireEvent.click(items[0]);
    expect(screen.getAllByTestId('evidence-card').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByTestId('polarity-chip-0'));
    fireEvent.click(screen.getByTestId('polarity-chip-+'));
    fireEvent.click(screen.getByTestId('polarity-chip--'));
    expect(screen.getByText(/点节点高亮关联边/)).toBeInTheDocument();
    expect(screen.getByTestId('visible-count')).toHaveTextContent('0/50');
    expect(screen.getByTestId('empty-filter-hint')).toHaveTextContent('当前筛选无匹配边 · 点右上「重置」恢复');
  });
});
