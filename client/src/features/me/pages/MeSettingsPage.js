import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRotateLeft, FaTrashCan } from 'react-icons/fa6';
import { getSettings, resetSettings, SETTINGS_EVENT, updateSetting } from '../settings';
import { clearFavorites } from '../favorites';
import { clearRecentlyViewed } from '../../history/recentlyViewed';
import { clearAllPlaybackProgress } from '../../history/playbackProgress';

const Toggle = ({ checked, onChange, label, description }) => (
  <label className='flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
    <div><p className='font-bold text-white'>{label}</p><p className='mt-1 text-xs leading-5 text-neutral-500'>{description}</p></div>
    <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-neutral-700'}`}><input className='sr-only' type='checkbox' checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} /></span>
  </label>
);

const MeSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const refresh = () => setSettings(getSettings());
    window.addEventListener(SETTINGS_EVENT, refresh);
    return () => window.removeEventListener(SETTINGS_EVENT, refresh);
  }, []);

  return (
    <div className='mx-auto w-full max-w-[760px] px-3 pb-28 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12'>
      <button type='button' onClick={() => navigate('/me')} className='mb-3 inline-flex items-center gap-2 text-sm font-bold text-neutral-400 transition hover:text-white'><FaArrowLeft /> Back</button>
      <h1 className='text-2xl font-black text-white sm:text-3xl'>Settings</h1>
      <p className='mt-1 text-sm text-neutral-500'>Playback preferences and on-device data.</p>

      <div className='mt-6 space-y-3'>
        <Toggle checked={settings.autoplayNextEpisode} onChange={(value) => setSettings(updateSetting('autoplayNextEpisode', value))} label='Autoplay Next Episode' description='Start the next available episode automatically when the current episode ends.' />
      </div>

      <div className='mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]'>
        <button type='button' onClick={() => { clearRecentlyViewed(); clearAllPlaybackProgress(); }} className='flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-bold text-neutral-300 transition hover:bg-white/5'><FaTrashCan className='text-neutral-500' /> Clear Watch Activity</button>
        <button type='button' onClick={clearFavorites} className='flex w-full items-center gap-3 border-t border-white/10 px-4 py-4 text-left text-sm font-bold text-neutral-300 transition hover:bg-white/5'><FaTrashCan className='text-neutral-500' /> Clear Favorites</button>
        <button type='button' onClick={resetSettings} className='flex w-full items-center gap-3 border-t border-white/10 px-4 py-4 text-left text-sm font-bold text-neutral-300 transition hover:bg-white/5'><FaRotateLeft className='text-neutral-500' /> Reset Settings</button>
        <button type='button' onClick={() => { clearRecentlyViewed(); clearAllPlaybackProgress(); clearFavorites(); resetSettings(); }} className='flex w-full items-center gap-3 border-t border-white/10 px-4 py-4 text-left text-sm font-bold text-red-300 transition hover:bg-red-500/5'><FaTrashCan /> Clear All Local Data</button>
      </div>

      <p className='mt-4 text-xs leading-5 text-neutral-600'>CineVerse stores these preferences, favorites and watch activity only on this device. No account or personal profile is required.</p>
    </div>
  );
};

export default MeSettingsPage;
