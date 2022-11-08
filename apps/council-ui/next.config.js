/* eslint-disable @typescript-eslint/no-var-requires*/
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase) => {
  // Development Config
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      // This makes it possible to call `next export` when using next/image with
      // imported assets
      images: {
        loader: "akamai",
        path: "./",
      },
    };
  } else {
    // Production Config
    return {
      reactStrictMode: true,
      // js chunks and css files should have "./" appended to them so that GitHub
      // pages can resolve them.
      assetPrefix: "./",
      // This makes it possible to call `next export` when using next/image with
      // imported assets
      images: {
        loader: "akamai",
        path: "./",
      },
    };
  }
};
