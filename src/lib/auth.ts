import NextAuth from "next-auth"
import { authConfig } from "./auth.config";
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }), 
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z.object({
          email: z.string().email(),
          password: z.string().min(8)
        }).safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            console.log("No user found with this email");
            return null;
          }
          const isPasswordValid = await bcryptjs.compare(password, user.password);
          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }
          console.log("User found and password is valid", user);
          return user;
        }
        return null;
      },
    }
  )],
});
