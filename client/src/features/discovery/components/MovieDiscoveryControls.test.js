import { fireEvent, render, screen } from '@testing-library/react';
import MovieDiscoveryControls from './MovieDiscoveryControls';

const filters = {
  genre: '',
  year: '',
  rating: '',
  language: '',
  sort: 'popularity.desc',
};

test('renders movie discovery filters and reports changes', () => {
  const onChange = jest.fn();
  const onReset = jest.fn();

  render(
    <MovieDiscoveryControls
      filters={filters}
      genres={[{ id: 28, name: 'Action' }]}
      onChange={onChange}
      onReset={onReset}
    />
  );

  fireEvent.change(screen.getByLabelText('Genre'), { target: { value: '28' } });
  expect(onChange).toHaveBeenCalledWith('genre', '28');

  fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
  expect(onReset).toHaveBeenCalledTimes(1);
});
