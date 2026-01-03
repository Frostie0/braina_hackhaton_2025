"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confidentialite",
];

interface AppGuardProps {
  children: ReactNode;
}

export default function AppGuard({ children }: AppGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    const isPublic = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isPublic) {
      setChecked(true);
      return;
    }

    if (!loading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [pathname, isAuthenticated, loading, router]);

  if (!checked && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Chargement...</p>
      </div>
    );
  }

  return <>{children}</>;
}
