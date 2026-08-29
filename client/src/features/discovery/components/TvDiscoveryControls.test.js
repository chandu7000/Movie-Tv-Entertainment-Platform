import { fireEvent, render, screen } from '@testing-library/react';
import TvDiscoveryControls from './TvDiscoveryControls';

const filters = { genre: '', year: '', rating: '', language: '', sort: 'popularity.desc' };

test('renders TV discovery filters and reports changes', () => {
  const onChange = jest.fn();
  const onReset = jest.fn();
  render(<TvDiscoveryControls filters={filters} genres={[{ id: 18, name: 'Drama' }]} onChange={onChange} onReset={onReset} />);
  fireEvent.change(screen.getByLabelText('Genre'), { target: { value: '18' } });
  expect(onChange).toHaveBeenCalledWith('genre', '18');
  fireEvent.click(screen.getByRole('button', { name: 'Reset TV filters' }));
  expect(onReset).toHaveBeenCalledTimes(1);
});
