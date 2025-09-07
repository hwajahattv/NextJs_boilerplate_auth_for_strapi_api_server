"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSnackbar } from "@/components/Common/SnackbarProvider";
import { useSearchParams } from "next/navigation";

const VerifyEmailForm = () => {
  const { showMessage } = useSnackbar();
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmation = searchParams.get("confirmation");
    showMessage("Email verified successfully!", "success");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmation = searchParams.get("confirmation") || true;

  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center">
      {confirmation ? (
        <>
          <span className="mb-4 text-lg font-medium text-green-600">
            Your email has been verified!
          </span>
          <Link
            href="/auth/signin"
            className="bg-primary hover:bg-primary/90 mt-2 rounded px-6 py-2 font-medium text-white transition"
          >
            Go to Login
          </Link>
        </>
      ) : (
        <span className="text-lg font-medium text-red-600">
          Invalid or missing confirmation token.
        </span>
      )}
    </div>
  );
};

export default VerifyEmailForm;
