import '../styles/App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setBannerData, setImageURL } from './movieSlice';
import { restoreSession } from '../features/auth/authSlice';
import { getConfiguration, getTrending } from '../api/tmdbApi';
import AppShell from '../components/layout/AppShell';

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]);

  useEffect(() => {
    dispatch(restoreSession());

    const handleExpiredSession = () => dispatch(restoreSession());

    window.addEventListener(
      'cineverse:session-expired',
      handleExpiredSession
    );

    return () =>
      window.removeEventListener(
        'cineverse:session-expired',
        handleExpiredSession
      );
  }, [dispatch]);

  useEffect(() => {
    let active = true;

    const initializeApp = async () => {
      try {
        const [trendingResponse, configurationResponse] = await Promise.all([
          getTrending(),
          getConfiguration(),
        ]);

        if (!active) return;

        dispatch(
          setBannerData(trendingResponse.data.results || [])
        );

        dispatch(
          setImageURL(
            `${configurationResponse.data.images.secure_base_url}original`
          )
        );
      } catch (error) {
        console.error(
          'Unable to initialize MovieApp data:',
          error
        );
      }
    };

    initializeApp();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return <AppShell />;
}

export default App;