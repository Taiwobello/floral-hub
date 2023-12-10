// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["storage.googleapis.com"],
    unoptimized: true
  },
  trailingSlash: true
  // exportPathMap(defaultPathMap) {
  //   return {
  //     ...defaultPathMap,
  //     "/404": { page: "/404" }
  //   };
  // }
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en"
  // }
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: "jaycodist",
  project: "javascript-nextjs",
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
