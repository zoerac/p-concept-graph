import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App end-to-end interaction', () => {
  it('node -> edge -> blank click walks the full selection cycle', () => {
    const { container } = render(<App />);
    expect(screen.getByText(/点击节点或边/)).toBeInTheDocument();

    fireEvent.click(container.querySelector('[data-node-id="ph"]')!);
    const items = screen.getAllByTestId('edge-list-item');
    expect(items).toHaveLength(10);
    expect(container.querySelectorAll('[data-dimmed="true"]').length).toBeGreaterThan(0);

    fireEvent.click(items[0]);
    expect(screen.queryAllByTestId('edge-list-item')).toHaveLength(0);
    expect(screen.getAllByTestId('evidence-card').length).toBeGreaterThan(0);

    fireEvent.click(container.querySelector('svg')!);
    expect(screen.getByText(/点击节点或边/)).toBeInTheDocument();
    expect(container.querySelectorAll('[data-dimmed="true"]')).toHaveLength(0);
  });
});
