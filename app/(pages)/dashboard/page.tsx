import { Metadata } from "next";
import DashboardClient from "@/components/pages/DashboardClient";

export const metadata: Metadata = {
  title: {
    absolute: "Dashboard | Braina",
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
