import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

// Mock the backend API client so Jest does not load Axios ESM.
jest.mock('../api/appApiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  },
}));

// Mock TMDB API calls used by the Home page.
jest.mock('../api/tmdbApi', () => ({
  getTrending: jest.fn().mockResolvedValue({
    data: {
      results: [],
    },
  }),

  getConfiguration: jest.fn().mockResolvedValue({
    data: {
      images: {
        secure_base_url: 'https://image.tmdb.org/t/p/',
      },
    },
  }),

  getList: jest.fn().mockResolvedValue({
    data: {
      results: [],
    },
  }),

  getDetails: jest.fn().mockResolvedValue({
    data: {},
  }),
}));

// Import application modules after mocks.
const App = require('./App').default;
const Home = require('../features/home/pages/Home').default;
const store = require('./store').default;

test('renders the CineVerse shell, navigation and home content', async () => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
    ],
    {
      initialEntries: ['/'],
    }
  );

  render(
    <Provider store={store}>
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
      />
    </Provider>
  );

  expect(
    await screen.findByText('Trending Today')
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText('CineVerse home')
  ).toBeInTheDocument();

  expect(
    screen.getByRole('navigation', {
      name: 'Primary navigation',
    })
  ).toBeInTheDocument();

  expect(
    screen.getAllByText('Movies').length
  ).toBeGreaterThan(0);

  expect(
    screen.getAllByText('TV Shows').length
  ).toBeGreaterThan(0);

  expect(
    screen.getAllByText('Discover').length
  ).toBeGreaterThan(0);
});