/** Emails allowed internal tooling behaviour (e.g. cross-client Mongo reads). Same env as sign-in bypass. */

export function parseBypassEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

const bypassEmails = parseBypassEmails(process.env.AUTH_BYPASS_EMAILS);

export function isAuthBypassEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return bypassEmails.has(email.trim().toLowerCase());
}
