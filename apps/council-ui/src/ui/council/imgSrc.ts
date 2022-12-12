/**
 * Image files are held in the public/ directory. This creates the correct `src`
 * string to use in an <img> tag.
 */
export function makeImgSrc(fileNameInPublicDirectory: string): string {
  // Static deployments set a basePath in NextJS for all static assets present
  // in the <head> section, however this doesn't work for img tags because `src`
  // is just a string. To solve this, we construct the basePath + imgSrc
  // ourselves.
  if (process.env.NEXT_PUBLIC_COUNCIL_UI_BASE_PATH) {
    const basePath = process.env.NEXT_PUBLIC_COUNCIL_UI_BASE_PATH;
    return `${basePath}${fileNameInPublicDirectory}`;
  }

  return `/${fileNameInPublicDirectory}`;
}
