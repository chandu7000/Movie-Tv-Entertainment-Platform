import React,{useCallback,useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import Button from '../../../components/ui/Button';
import {addLibraryItem,checkLibraryItem,removeLibraryItem} from '../../../api/userDataApi';
import {openAuthGate} from '../../auth/authGateSlice';

const SaveToggle=({kind,media,mediaType})=>{
  const dispatch=useDispatch();
  const user=useSelector(state=>state.auth.user);
  const[saved,setSaved]=useState(false);
  const[loading,setLoading]=useState(false);
  const label=kind==='watchlist'?'Watchlist':'Favorite';
  const refresh=useCallback(async()=>{if(!user||!media?.tmdbId)return;try{const response=await checkLibraryItem(kind,mediaType,media.tmdbId);setSaved(Boolean(response.data?.data?.saved));}catch(_){setSaved(false);}},[kind,media?.tmdbId,mediaType,user]);
  useEffect(()=>{refresh();},[refresh]);
  const toggle=async()=>{
    if(!user){dispatch(openAuthGate({title:`Sign in to use ${label}`,message:`Login or create an account to save titles to your ${label.toLowerCase()} and sync your CineVerse activity.`}));return;}
    try{setLoading(true);if(saved)await removeLibraryItem(kind,mediaType,media.tmdbId);else await addLibraryItem(kind,media);setSaved(value=>!value);}finally{setLoading(false);}
  };
  return <Button variant={saved?'primary':'secondary'} onClick={toggle} disabled={loading}>{loading?'Saving...':saved?`✓ In ${label}`:`+ ${label}`}</Button>;
};
export default SaveToggle;
