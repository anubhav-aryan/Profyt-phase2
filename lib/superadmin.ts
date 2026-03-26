/** Super-admin emails (Google OAuth) that may access /admin and /api/admin. Comma-separated in env. */

export function parseSuperAdminEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

const superAdminEmails = parseSuperAdminEmails(process.env.SUPERADMIN_EMAILS);

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return superAdminEmails.has(email.trim().toLowerCase());
}
