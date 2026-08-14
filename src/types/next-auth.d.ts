import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      username?: string;
      githubId?: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User {
    username?: string;
    githubId?: string;
  }

  interface JWT {
    username?: string;
    githubId?: string;
    accessToken?: string;
  }
}
