import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { closeAuthGate } from './authGateSlice';

const AuthRequiredModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, title, message } = useSelector((state) => state.authGate);

  if (!open) return null;

  const goTo = (path) => {
    dispatch(closeAuthGate());
    navigate(path);
  };

  return (
    <Modal close={() => dispatch(closeAuthGate())} label='Sign in required' className='max-w-lg'>
      <div className='p-7 sm:p-9'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-950'>
          <FaLock aria-hidden='true' />
        </div>
        <p className='mt-6 text-xs font-black uppercase tracking-[0.25em] text-neutral-500'>CineVerse Access</p>
        <h2 className='mt-2 text-3xl font-black tracking-tight text-white'>{title}</h2>
        <p className='mt-3 text-sm leading-6 text-neutral-400'>{message}</p>
        <div className='mt-7 grid gap-3 sm:grid-cols-2'>
          <Button onClick={() => goTo('/login')} className='w-full'>Login</Button>
          <Button onClick={() => goTo('/register')} variant='secondary' className='w-full'>Create Account</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthRequiredModal;
