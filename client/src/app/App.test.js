import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

jest.mock('../api/appApiClient', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: {} }), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

jest.mock('../api/tmdbApi', () => ({
  getTrending: jest.fn().mockResolvedValue({ data: { results: [] } }),
  discoverMedia: jest.fn().mockResolvedValue({ data: { results: [] } }),
  getConfiguration: jest.fn().mockResolvedValue({ data: { images: { secure_base_url: 'https://image.tmdb.org/t/p/' } } }),
  getList: jest.fn().mockResolvedValue({ data: { results: [] } }),
  getDetails: jest.fn().mockResolvedValue({ data: {} }),
}));

const App = require('./App').default;
const Home = require('../features/home/pages/Home').default;
const store = require('./store').default;

test('renders the public CineVerse shell and navigation', async () => {
  const router = createMemoryRouter([{ path: '/', element: <App />, children: [{ index: true, element: <Home /> }] }], { initialEntries: ['/'] });
  render(<Provider store={store}><RouterProvider router={router} /></Provider>);
  expect(await screen.findByText('Telugu New Releases')).toBeInTheDocument();
  expect(screen.getByLabelText('CineVerse home')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
  expect(screen.getAllByText('Movies').length).toBeGreaterThan(0);
  expect(screen.getAllByText('TV Shows').length).toBeGreaterThan(0);
});
