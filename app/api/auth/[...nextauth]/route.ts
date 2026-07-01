import dbConnect from "@/backend/config/dbConfig";
import userModel, { IUser } from "@/backend/models/user";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Token = {
  user: IUser;
};

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const userr = await userModel.findOne({ email: credentials.email }).select("+password");
        if (!userr) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatched = await bcrypt.compare(credentials.password, userr.password);
        if (!isPasswordMatched) {
          throw new Error("Invalid email or password");
        }

        return userr as any;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      const jwtToken = token as Token;
      if (user) {
        token.user = user as any;
      }

      // When session is updated (e.g. profile update), re-fetch from DB
      if (trigger === "update") {
        const updatedUser = await userModel.findById(jwtToken?.user?._id);
        token.user = updatedUser as any;
      }

      return token;
    },
    // That block is where you define what the session object will look like when you call useSession() on the client side.
    session: async ({ session, token }) => {
      const jwtToken = token as Token;
      session.user = jwtToken.user as any;
      // @ts-ignore
      delete session?.user?.password;
      return session;
    },
  },

  // This tells NextAuth: if the user needs to sign in, send them to /login instead of the default page.
  // So when the middleware sees no valid session for /me/update, it triggers a redirect to /login.
  pages: {
    signIn: "/login",
    // So now your app can have a custom login page at /login with your own UI.
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
