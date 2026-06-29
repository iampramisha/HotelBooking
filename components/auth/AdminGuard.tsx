"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.user?.role !== "admin") {
      router.replace("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
