import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

test('empty state renders action and invokes it', () => {
  const onAction = jest.fn();
  render(<EmptyState title='Nothing saved' message='Add a movie.' actionLabel='Browse' onAction={onAction} />);
  expect(screen.getByText('Nothing saved')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Browse' }));
  expect(onAction).toHaveBeenCalledTimes(1);
});

test('error state is accessible and retries', () => {
  const onRetry = jest.fn();
  render(<ErrorState message='Unable to load.' onRetry={onRetry} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load.');
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});
