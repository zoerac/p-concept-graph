import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { GraphProvider } from '../context/GraphContext';
import FilterPanel from './FilterPanel';

const renderPanel = () => render(<GraphProvider><FilterPanel /></GraphProvider>);

describe('FilterPanel', () => {
  it('shows all three polarities on by default with the full count', () => {
    renderPanel();
    expect(screen.getByTestId('visible-count')).toHaveTextContent('50/50');
    for (const p of ['+', '-', '0']) {
      expect(screen.getByTestId(`polarity-chip-${p}`)).toHaveAttribute('aria-checked', 'true');
    }
    expect(screen.queryByTestId('reset-filter')).toBeNull();
  });

  it('hides negative edges when the negative chip is turned off', () => {
    renderPanel();
    fireEvent.click(screen.getByTestId('polarity-chip--'));
    expect(screen.getByTestId('visible-count')).toHaveTextContent('31/50');
    expect(screen.getByTestId('polarity-chip--')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('reset-filter')).toBeInTheDocument();
  });

  it('restores the full view when the chip is toggled back on', () => {
    renderPanel();
    const chip = () => screen.getByTestId('polarity-chip--');
    fireEvent.click(chip());
    fireEvent.click(chip());
    expect(screen.getByTestId('visible-count')).toHaveTextContent('50/50');
    expect(chip()).toHaveAttribute('aria-checked', 'true');
  });

  it('applies the evidence floor from the select', () => {
    renderPanel();
    fireEvent.change(screen.getByTestId('min-evidence-select'), { target: { value: '5' } });
    expect(screen.getByTestId('visible-count')).toHaveTextContent('15/50');
  });

  it('allows an all-off state and states it plainly', () => {
    renderPanel();
    fireEvent.click(screen.getByTestId('polarity-chip-+'));
    fireEvent.click(screen.getByTestId('polarity-chip--'));
    fireEvent.click(screen.getByTestId('polarity-chip-0'));
    expect(screen.getByTestId('visible-count')).toHaveTextContent('0/50');
  });

  it('resets everything with the reset button', () => {
    renderPanel();
    fireEvent.click(screen.getByTestId('polarity-chip--'));
    fireEvent.change(screen.getByTestId('min-evidence-select'), { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('reset-filter'));
    expect(screen.getByTestId('visible-count')).toHaveTextContent('50/50');
    expect((screen.getByTestId('min-evidence-select') as HTMLSelectElement).value).toBe('0');
    expect(screen.queryByTestId('reset-filter')).toBeNull();
  });

  it('prints the frozen per-polarity totals on the chips', () => {
    renderPanel();
    expect(screen.getByTestId('polarity-chip-+')).toHaveTextContent('22');
    expect(screen.getByTestId('polarity-chip--')).toHaveTextContent('19');
    expect(screen.getByTestId('polarity-chip-0')).toHaveTextContent('9');
  });
});
