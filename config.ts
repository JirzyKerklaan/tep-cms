export default {
  headless_mode: true,

  site: {
    site_name: 'TEPCMS',
    base_url: 'http://localhost:3000/',
  },
  api: {
    key: 'test',
  },
  session: {
    secret: 'your-secret-key',
  },
  convertToWebp: false,
  server: {
    PORT: 3000,
  },
};
