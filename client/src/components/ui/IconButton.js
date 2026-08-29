import React from 'react';

const variants = {
  default: 'border-white/10 bg-neutral-950/85 text-white hover:bg-neutral-800',
  glass: 'border-white/15 bg-black/45 text-white hover:bg-black/70',
  ghost: 'border-transparent bg-transparent text-neutral-200 hover:bg-white/10',
};

const IconButton = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}) => {
  const sizes = {
    sm: 'h-9 w-9 text-lg',
    md: 'h-10 w-10 text-xl',
    lg: 'h-12 w-12 text-2xl',
  };

  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border backdrop-blur transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:pointer-events-none disabled:opacity-50 ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
