"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Protected({children, error} : {children: React.ReactNode; error: any}) {
  const router = useRouter();

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 404) {
        toast.error("Page not found");
        return router.replace("/dashboard");
      }
    }
  }, [error])

  return children
}