const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://thenextshop.now.sh'
    : 'http://localhost:3000';

export default baseURL;
