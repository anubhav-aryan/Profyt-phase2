import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const CLIENT_PROFILES_COLLECTION = "clientprofiles";

function parseBypassEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

const bypassEmails = parseBypassEmails(process.env.AUTH_BYPASS_EMAILS);

const secret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "profyt-phase2-dev-secret-min-32-chars"
    : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;
      const email = user?.email?.trim().toLowerCase();
      if (!email) return false;
      if (bypassEmails.has(email)) return true;

      const { getMongoDb } = await import("@/lib/mongo");
      const db = await getMongoDb();
      const doc = await db
        .collection(CLIENT_PROFILES_COLLECTION)
        .findOne({ email }, { projection: { _id: 1 } });

      return doc !== null;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});
