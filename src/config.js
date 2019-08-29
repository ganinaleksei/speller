module.exports = {
  port: 8080,
  lang: "ru",
  fileSizeLimit: 50 * 1024 * 1024,
  limits: {
    period: 60 * 1000, // ms
    max: 5
  }
};
