import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../authSlice';
import Button from '../../../components/ui/Button';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const submit = (event) => {
    event.preventDefault();
    dispatch(login(form));
  };

  const message = typeof error === 'string' ? error : error?.message;
  const fieldErrors = error?.data?.errors || {};

  return (
    <section className='mx-auto flex min-h-[75vh] max-w-[1600px] items-center justify-center px-4 py-12 sm:px-6 lg:px-10'>
      <div className='w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur sm:p-8'>
        <p className='text-xs font-black uppercase tracking-[0.25em] text-neutral-500'>CineVerse Account</p>
        <h1 className='mt-2 text-3xl font-black text-white'>Welcome back</h1>
        <p className='mt-2 text-sm text-neutral-400'>Sign in to access your protected CineVerse profile.</p>

        <form onSubmit={submit} className='mt-7 space-y-4'>
          <label className='block text-sm font-bold text-neutral-300'>Email
            <input type='email' autoComplete='email' value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className='mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-white/30' required />
            {fieldErrors.email ? <span className='mt-1 block text-xs text-red-400'>{fieldErrors.email}</span> : null}
          </label>
          <label className='block text-sm font-bold text-neutral-300'>Password
            <input type='password' autoComplete='current-password' value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className='mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-white/30' required />
            {fieldErrors.password ? <span className='mt-1 block text-xs text-red-400'>{fieldErrors.password}</span> : null}
          </label>
          {message ? <p className='rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'>{message}</p> : null}
          <Button type='submit' className='w-full' disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <p className='mt-6 text-center text-sm text-neutral-400'>New to CineVerse? <Link className='font-bold text-white hover:underline' to='/register'>Create an account</Link></p>
      </div>
    </section>
  );
};

export default LoginPage;
