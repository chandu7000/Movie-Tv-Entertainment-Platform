import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import IconButton from './IconButton';

const Modal = ({ children, close, label = 'Dialog', className = '' }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const content = (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close?.();
      }}
      role='presentation'
    >
      <section
        className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 ${className}`}
        role='dialog'
        aria-modal='true'
        aria-label={label}
      >
        <IconButton
          onClick={close}
          variant='glass'
          size='sm'
          className='absolute right-3 top-3 z-50'
          aria-label='Close dialog'
        >
          <IoClose />
        </IconButton>
        {children}
      </section>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};

export default Modal;
