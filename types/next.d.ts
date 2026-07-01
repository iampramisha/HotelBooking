// types/global.d.ts (or any .d.ts included in tsconfig.json)
import { IUser } from "@/backend/models/user";
import "@reduxjs/toolkit/query"; // ensures module augmentation

// Extend Next.js NextRequest
declare module "next/server" {
  interface NextRequest {
    user?: IUser; // optional to avoid TS errors if not always set
  }
}

// Extend RTK Query error type
declare module "@reduxjs/toolkit/query" {
  interface FetchBaseQueryError {
    data?: {
      message?: string; // optional string
      [key: string]: any; // allow additional fields
    };
  }
}

// Extend next-auth Session and JWT to include IUser fields
declare module "next-auth" {
  interface Session {
    user?: {
      _id?: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      avatar?: { public_id: string; url: string };
    };
  }

  interface User {
    _id?: any;
    role?: string;
    avatar?: { public_id: string; url: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      _id?: any;
      name?: string | null;
      email?: string | null;
      role?: string;
      avatar?: { public_id: string; url: string };
    };
  }
}
