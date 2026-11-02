/**
 * Stand-in for `@react-email/render`, an optional peer of `resend` that this site does not install (the enquiry email
 * is plain text + HTML, never a React template). resend imports it lazily, only for a `react` email; the Workers
 * bundle (Cloudflare Pages) cannot leave the import unresolved, so nitro.alias points it here.
 */
export function render(): never {
  throw new Error('@react-email/render is not installed')
}
