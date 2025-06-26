export const BASE_URL = 'http://localhost:3008';
console.log(localStorage.getItem('token'));


export const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})