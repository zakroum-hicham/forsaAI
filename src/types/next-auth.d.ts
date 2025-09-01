import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

// Extend the NextAuth.js session and user types to include the 'id' and 'role' properties.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

// Extend the JWT token type to include the 'role' property.
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
  }
}