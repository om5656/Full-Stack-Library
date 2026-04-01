import api, { setAuthToken } from './api';

export async function registerUser(payload) {
  const { data } = await api.post('/user/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/user/login', payload);
  return data;
}

export async function getProfile(token) {
  setAuthToken(token);
  const { data } = await api.get('/user/me');
  return data.user;
}
