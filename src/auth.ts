import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded Super Admin auth as requested "For now"
        if (credentials?.username === "suprim" && credentials?.password === "suprim123") {
          return {
            id: "superadmin_1",
            name: "Super Admin",
            email: "suprim@streamcast.app",
            role: "SUPER_ADMIN",
          } as any;
        }
        return null; // Return null if user data could not be retrieved
      }
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CREATOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.id) {
        try {
          const client = await clientPromise;
          const db = client.db();
          
          const updateData: any = {
            access_token: account.access_token,
            expires_at: account.expires_at,
            scope: account.scope,
            id_token: account.id_token,
          };

          // ONLY update refresh_token if it's provided (Google only sends it once usually)
          if (account.refresh_token) {
            updateData.refresh_token = account.refresh_token;
          }
          
          await db.collection("accounts").updateOne(
            { 
              userId: new ObjectId(user.id), 
              provider: "google" 
            },
            { $set: updateData },
            { upsert: true }
          );
          console.log("Successfully synced Google tokens to DB for user:", user.id);
        } catch (error) {
          console.error("Failed to sync Google tokens to DB on signIn:", error);
        }
      }
    }
  }
});
