import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../app/App';
import Skeleton from '../components/ui/Skeleton';

const Home = lazy(() => import('../features/home/pages/Home'));
const ExplorePage = lazy(() => import('../features/discovery/pages/ExplorePage'));
const DetailsPage = lazy(() => import('../features/details/pages/DetailsPage'));
const SearchPage = lazy(() => import('../features/search/pages/SearchPage'));
const DiscoverPage = lazy(() => import('../features/discovery/pages/DiscoverPage'));
const WatchPage = lazy(() => import('../features/watch/pages/WatchPage'));
const TrailerPage = lazy(() => import('../features/watch/pages/TrailerPage'));
const MePage = lazy(() => import('../features/me/pages/MePage'));
const MeCollectionPage = lazy(() => import('../features/me/pages/MeCollectionPage'));
const MeSettingsPage = lazy(() => import('../features/me/pages/MeSettingsPage'));

const PageLoader = () => <div className='mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10'><Skeleton className='h-[60vh] w-full' /></div>;
const withSuspense = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { index: true, element: withSuspense(<Home />) },
    { path: 'movie', element: withSuspense(<ExplorePage />) },
    { path: 'tv', element: withSuspense(<ExplorePage />) },
    { path: 'discover', element: withSuspense(<DiscoverPage />) },
    { path: 'movie/:id', element: withSuspense(<DetailsPage />) },
    { path: 'tv/:id', element: withSuspense(<DetailsPage />) },
    { path: 'search', element: withSuspense(<SearchPage />) },
    { path: 'me', element: withSuspense(<MePage />) },
    { path: 'me/history', element: withSuspense(<MeCollectionPage />) },
    { path: 'me/favorites', element: withSuspense(<MeCollectionPage />) },
    { path: 'me/continue', element: withSuspense(<MeCollectionPage />) },
    { path: 'me/settings', element: withSuspense(<MeSettingsPage />) },
    { path: 'trailer/:mediaType/:id/:videoKey', element: withSuspense(<TrailerPage />) },
    { path: 'watch/movie/:id', element: withSuspense(<WatchPage />) },
    { path: 'watch/tv/:id/:season/:episode', element: withSuspense(<WatchPage />) },
  ],
}]);

export default router;
