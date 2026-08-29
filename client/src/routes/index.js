import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../app/App';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import Skeleton from '../components/ui/Skeleton';

const Home = lazy(() => import('../features/home/pages/Home'));
const ExplorePage = lazy(() => import('../features/discovery/pages/ExplorePage'));
const DetailsPage = lazy(() => import('../features/details/pages/DetailsPage'));
const SearchPage = lazy(() => import('../features/search/pages/SearchPage'));
const DiscoverPage = lazy(() => import('../features/discovery/pages/DiscoverPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ProfilePage = lazy(() => import('../features/auth/pages/ProfilePage'));
const LibraryPage = lazy(() => import('../features/library/pages/LibraryPage'));

const PageLoader = () => <div className='mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10'><Skeleton className='h-[60vh] w-full' /></div>;
const withSuspense = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;
const protectedPage = (element) => <ProtectedRoute>{withSuspense(element)}</ProtectedRoute>;

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { index: true, element: withSuspense(<Home />) },
    { path: 'movie', element: protectedPage(<ExplorePage />) },
    { path: 'tv', element: protectedPage(<ExplorePage />) },
    { path: 'discover', element: protectedPage(<DiscoverPage />) },
    { path: 'movie/:id', element: protectedPage(<DetailsPage />) },
    { path: 'tv/:id', element: protectedPage(<DetailsPage />) },
    { path: 'search', element: protectedPage(<SearchPage />) },
    { path: 'login', element: withSuspense(<LoginPage />) },
    { path: 'register', element: withSuspense(<RegisterPage />) },
    { path: 'profile', element: protectedPage(<ProfilePage />) },
    { path: 'watchlist', element: protectedPage(<LibraryPage kind='watchlist' />) },
    { path: 'favorites', element: protectedPage(<LibraryPage kind='favorite' />) },
  ],
}]);

export default router;
