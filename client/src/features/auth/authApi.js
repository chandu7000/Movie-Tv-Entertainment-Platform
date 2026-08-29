import appApiClient from '../../api/appApiClient';

export const registerAccount = (payload) => appApiClient.post('/auth/register', payload);
export const loginAccount = (payload) => appApiClient.post('/auth/login', payload);
export const logoutAccount = () => appApiClient.post('/auth/logout');
export const getCurrentUser = () => appApiClient.get('/auth/me');
