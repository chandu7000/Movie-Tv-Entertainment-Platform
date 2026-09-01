import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';

const AppShell = () => {
  const location = useLocation();
  const immersivePlayback = location.pathname.startsWith('/watch/') || location.pathname.startsWith('/trailer/');

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      {!immersivePlayback ? <Header /> : null}
      <main className={`${immersivePlayback ? 'pt-0 pb-0' : 'min-h-[88vh] pb-20 pt-16 lg:pb-0'}`}><Outlet /></main>
      {!immersivePlayback ? <Footer /> : null}
      {!immersivePlayback ? <MobileNavigation /> : null}
    </div>
  );
};

export default AppShell;
