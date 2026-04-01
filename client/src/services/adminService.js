import api, { setAuthToken } from './api';

export async function createBook(formData, token) {
  setAuthToken(token);
  const { data } = await api.post('/admin/book', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}

export async function deleteBook(bookId, token) {
  setAuthToken(token);
  const { data } = await api.delete(`/admin/book/${bookId}`);
  return data;
}
