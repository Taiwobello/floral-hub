module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["storage.googleapis.com"],
    unoptimized: true
  },
  trailingSlash: true,
  exportPathMap() {
    return {
      "/404": { page: "/404" }
    };
  }
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en"
  // }
};
