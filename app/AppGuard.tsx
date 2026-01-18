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

  // Vérification synchrone pour les routes publiques
  const isPublic = pathname ? PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  ) : false;

  useEffect(() => {
    if (!pathname) return;

    // Si c'est public, on a déjà rendu, rien à faire de plus pour la redirection
    if (isPublic) {
      setChecked(true);
      return;
    }

    if (!loading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [pathname, isAuthenticated, loading, router, isPublic]);

  // Si c'est une route publique, on rend directement les enfants (SSR friendly)
  if (isPublic) {
    return <>{children}</>;
  }

  // Pour les routes protégées, on attend la vérification
  if (!checked && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Chargement...</p>
      </div>
    );
  }

  return <>{children}</>;
}
