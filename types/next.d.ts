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
