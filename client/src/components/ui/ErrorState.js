import React from 'react';
import Button from './Button';
const ErrorState=({message='We couldn’t load this content right now.',onRetry})=><div role='alert' className='rounded-2xl border border-red-400/20 bg-red-500/10 px-6 py-5 text-sm text-red-100'><p>{message}</p>{onRetry?<Button variant='secondary' className='mt-4 text-xs' onClick={onRetry}>Retry</Button>:null}</div>;
export default ErrorState;
