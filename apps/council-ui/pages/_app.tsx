import dynamic from "next/dynamic";
import "src/styles/globals.css";

// We import the root of the app dynamically to turn off SSR for the entire app tree
// This is because NextJS and injected connectors (i.e. wagmi) don't integrate well and lead to
// https://nextjs.org/docs/messages/react-hydration-error errors
// In production the app will be build using next export which is client-side rendering based.
// Although for the development server we have to turn off SSR manually.
const DynamicApp = dynamic(() => import("./app"), {
  ssr: false,
});

export default DynamicApp;
