'use client';

import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import OwnerDashboard from "@/components/OwnerDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === 'OWNER') {
    return <OwnerDashboard />;
  }

  return <EmployeeDashboard />;
}
