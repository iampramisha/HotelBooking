import dbConnect from "@/backend/config/dbConfig";
import userModel, { IUser } from "@/backend/models/user";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Token={
  user:IUser;
}
async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
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

          return userr;
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        const jwtToken=token as Token;
        if (user) {
          token.user = user;
        }
        ///api/auth/session is the built-in NextAuth route to get the current session.


        if(req.url?.includes("/api/auth/session?update")){
          //hit the db and return the updated user
          const updateduser=await userModel.findById(jwtToken?.user?._id)
          token.user=updateduser
        }
        return token;
      },
      // That block is where you define what the session object will look like when you call useSession() on the client side.
      session: async ({ session, token }) => {
      
        session.user = token.user as IUser;
      //@ts-ignore
      delete session?.user?.password;
        return session;
      },
    },


//     This tells NextAuth: “if the user needs to sign in, send them to /login instead of the default page”.

// So when the middleware sees no valid session for /me/update, it triggers a redirect to /login.
    pages:{
signIn:'/login'
//So now your app can have a custom login page at /login with your own UI.
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export { auth as GET, auth as POST };

