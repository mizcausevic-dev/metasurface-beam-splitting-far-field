export const SITE_URL =
  "https://mizcausevic-dev.github.io/metasurface-beam-splitting-far-field";

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
