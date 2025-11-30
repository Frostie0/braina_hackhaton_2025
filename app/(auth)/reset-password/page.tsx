import React, { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Créez un nouveau mot de passe pour votre compte Braina",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  );
}
