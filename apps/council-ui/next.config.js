/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  // js chunks and css files should have "./" appended to them so that GitHub
  // pages can resolve them.
  assetPrefix: "./",
  images: {
    loader: 'akamai',
    path: './'
  }
};
