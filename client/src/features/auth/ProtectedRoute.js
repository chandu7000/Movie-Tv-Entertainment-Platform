import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from '../../components/ui/Skeleton';
import { openAuthGate } from './authGateSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initialized, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized || loading || user) return;
    dispatch(openAuthGate({
      title: 'Sign in to continue',
      message: 'This CineVerse area is available to registered users. Login or create an account to continue.',
    }));
    navigate('/', { replace: true, state: { blockedPath: location.pathname } });
  }, [dispatch, initialized, loading, location.pathname, navigate, user]);

  if (!initialized || loading) {
    return <div className='mx-auto max-w-3xl px-4 py-16'><Skeleton className='h-52 w-full' /></div>;
  }

  if (!user) return null;
  return children;
};

export default ProtectedRoute;
