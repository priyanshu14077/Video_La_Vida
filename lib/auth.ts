import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions  = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),

        CredentialsProvider({ 
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"} ,
                password: { label: "Password", type: "password" }
            }, 
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        throw new Error("No user found with this email");
                    }
                    
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                        if (!isValid) {
                            throw new Error ("invalid password");
                        }

                        return {
                            id : user.id.toString(),
                            email: user.email,
                            name: user.name,
                        }
                    }  catch (error) {
                        console.error("Error during authorization:", error);
                        throw error;

                    }
                },

        }),


       
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                return true;
            }
            return true;
        },
        async jwt({token , user, account }) {
            if (user){
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    pages:{
        signIn: "/login",
        error: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    secret: process.env.NEXTAUTH_SECRET, 

};