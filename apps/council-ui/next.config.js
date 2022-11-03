/**
 * @type {import('next').NextConfig}
 */
module.exports = {
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
