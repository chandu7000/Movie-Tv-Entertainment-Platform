import React from 'react';
import Button from './Button';
const EmptyState=({title='Nothing Here Yet',message='Try another selection or check back later.',actionLabel,onAction})=><div className='rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center'><h3 className='text-lg font-semibold text-white'>{title}</h3><p className='mx-auto mt-2 max-w-md text-sm text-neutral-400'>{message}</p>{actionLabel&&onAction?<Button className='mt-5' onClick={onAction}>{actionLabel}</Button>:null}</div>;
export default EmptyState;
