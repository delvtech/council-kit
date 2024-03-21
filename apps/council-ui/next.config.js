/* eslint-disable @typescript-eslint/no-var-requires*/
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase) => {
  // Development Config
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      redirects,
      reactStrictMode: true,
    };
  }

  // Production Config
  return {
    reactStrictMode: true,
    redirects,

    // The default Next 13 minifier has a bug which makes react-tooltip not work
    // in production environments. Turn this off. See:
    // https://github.com/ReactTooltip/react-tooltip/issues/933
    swcMinify: false,

    basePath: process.env.NEXT_PUBLIC_COUNCIL_UI_BASE_PATH ?? "",

    i18n: {
      locales: ["en-US", "zh-CN"],
      defaultLocale: "en-US",
    },
  };
};

async function redirects() {
  return [
    {
      source: "/",
      destination: "/proposals",
      permanent: true,
    },
  ];
}
