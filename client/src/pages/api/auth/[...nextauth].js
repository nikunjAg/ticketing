import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

import serverAxios from '@/redux/serverAxios';
import { errorHandler } from "@/utils";

const getApiUrl = (method) => {
  const isLoginReq = method?.toLowerCase() === 'login';
  return `/api/users/${isLoginReq ? 'signin' : 'signup'}`;
}

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    providers: [
      Credentials({
        async authorize(credentials) {
          try {

            const { email, password, method } = credentials;

            const API_URL = getApiUrl(method);

            const response = await serverAxios.post(API_URL, { email, password });
            
            const cookies = response.headers['set-cookie'];
            res.setHeader('Set-Cookie', cookies);
            
            return response.data;
          } catch (error) {
            errorHandler(error);
            if (error.response) {
              throw new Error(error.response.data.errors[0].message);
            } else if (error.request) {
              throw new Error(error.request);
            } else {
              throw new Error(error.message);
            }
          }
        }
      })
    ],
    jwt: true,
    secret: "1234",
    callbacks: {
      jwt ({ token, user, }) {
        if (user) {
          token.user = {
            ...(token.user || {}),
            id: user.id,
            email: user.email,
          }
        }

        return token;
      },
      session ({ session, token, }) {
        if (token) {
          session.user = {
            ...(session.user || {}),
            id: token.user.id,
            email: token.user.email,
          };
        }

        return session;
      },
    },
    events: {
      signOut () {
        res.setHeader("Set-Cookie", [
          "session=deleted;Max-Age=0;path=/;",
          "Refresh=deleted;Max-Age=0;path=/;"
        ]);
      }
    }
  });
};