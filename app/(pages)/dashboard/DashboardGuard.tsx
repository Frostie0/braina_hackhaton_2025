"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardClient from "@/components/pages/DashboardClient";
import { isAuthenticated as storageIsAuthenticated } from "@/lib/storage/userStorage";

export default function DashboardGuard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = storageIsAuthenticated();
    if (!auth) {
      router.replace("/login");
      return;
    }

    setAllowed(true);
    setChecked(true);
  }, [router]);

  if (!checked && !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (!allowed) return null;

  return <DashboardClient />;
}
