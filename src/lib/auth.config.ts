import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({auth, request: {nextUrl}}) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/manage");
      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        }
        // Redirect to login page if not logged in
        return Response.redirect(new URL("/login", nextUrl));
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        // Redirect to dashboard if logged in and trying to access login page
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({token, user}) {
      if (user) {
        token.id = user.id ?? "";
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
      }
      return session;
    }
  }
  
} satisfies NextAuthConfig;