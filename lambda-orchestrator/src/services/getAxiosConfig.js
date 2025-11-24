const getAxiosConfig = () => ({
  headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` }
});

module.exports = getAxiosConfig;