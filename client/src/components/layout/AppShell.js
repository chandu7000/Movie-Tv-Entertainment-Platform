import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import AuthRequiredModal from '../../features/auth/AuthRequiredModal';

const AppShell = () => {
  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <Header />
      <main className='min-h-[88vh] pb-20 pt-16 lg:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <AuthRequiredModal />
    </div>
  );
};

export default AppShell;
