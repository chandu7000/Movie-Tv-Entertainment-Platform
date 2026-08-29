import React from 'react';

const variants = {
  primary: 'bg-white text-neutral-950 hover:bg-neutral-200',
  secondary: 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  ghost: 'bg-transparent text-neutral-200 hover:bg-white/10',
};

const Button = ({ children, className = '', variant = 'primary', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:pointer-events-none disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
