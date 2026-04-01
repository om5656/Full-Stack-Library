import api from './api';

export async function getBooks() {
  const { data } = await api.get('/books');
  return data.books;
}
