'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Check for token on the client side
    const token = document.cookie

    if (token) {
      router.replace('/dashboard?toast=Page not found');
    } else {
      router.replace('/authentication/login');
    }
  }, [router]);

  return null; // or a loading spinner while redirecting
}