"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/applicant/overview");
  }, [router]);

  return null; // Nothing to render; just a redirect
}
