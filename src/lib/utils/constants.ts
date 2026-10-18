// Canonical public origin; previews and dev still point crawlers at production.
export const SITE_URL = "https://guestbook.ekel.dev";

export const NEXT_PUBLIC_DEVELOPMENT_URL = process.env
  .NEXT_PUBLIC_DEVELOPMENT_URL as string;
export const NEXT_PUBLIC_PRODUCTION_URL = process.env
  .NEXT_PUBLIC_PRODUCTION_URL as string;
export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL as string;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string;

export const NEXT_PUBLIC_DEVELOPMENT_API_URL = process.env
  .NEXT_PUBLIC_DEVELOPMENT_API_URL as string;
export const NEXT_PUBLIC_PRODUCTION_API_URL = process.env
  .NEXT_PUBLIC_PRODUCTION_API_URL as string;
