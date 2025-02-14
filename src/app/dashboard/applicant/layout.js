"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "applicant") {
      router.replace("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
}
