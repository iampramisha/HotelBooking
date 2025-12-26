import {withAuth} from "next-auth/middleware"
export default withAuth
  (  function middleware(req){

    })
//This tells NextAuth: “if the user needs to sign in, send them to /login instead of the default page”.

// So when the middleware sees no valid session for /me/update, it triggers a redirect to /login.
export const config={
    matcher:['/me/:path*']
}
//This will make the middleware only run on URLs that match /me/....

// But by itself, this does not enforce authentication. It just tells Next.js “run middleware here.”

// 2️⃣ Why we use withAuth

// withAuth is a wrapper provided by NextAuth to automatically protect routes.

// It handles:

// Checking if a user is logged in (req.nextauth.token exists).

// Redirecting unauthenticated users to login.

// Optionally allowing public routes.