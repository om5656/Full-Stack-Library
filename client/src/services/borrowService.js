import api, { setAuthToken } from './api';

export async function borrowBook(bookId, token) {
  setAuthToken(token);
  const { data } = await api.post('/user/borrow', { bookId });
  return data;
}

export async function getMyBorrows(token) {
  setAuthToken(token);
  const { data } = await api.get('/user/borrows');
  return data.borrows;
}

export async function returnBorrow(borrowId, token) {
  setAuthToken(token);
  const { data } = await api.put(`/user/return/${borrowId}`);
  return data;
}
