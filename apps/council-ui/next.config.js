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
    };
  }

  // Production Config
  return {
    reactStrictMode: true,
    basePath: process.env.NEXT_PUBLIC_COUNCIL_UI_BASE_PATH ?? "",
  };
};
