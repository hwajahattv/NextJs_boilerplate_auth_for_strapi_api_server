"use client";

import { useState } from "react";
import { useSnackbar } from "@/components/Common/SnackbarProvider";
import { resetPassword } from "@/lib/api/auth";

const ResetPasswordForm = () => {
  const { showMessage } = useSnackbar();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the reset code from the URL (e.g., /resetpassword?code=...)
  const code =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("code") || ""
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!code) {
      showMessage("Invalid or missing reset code.", "error");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      showMessage("Passwords do not match.", "error");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ code, password, passwordConfirmation });
      showMessage("Password has been reset successfully!", "success");
    } catch (error: any) {
      showMessage(error.message || "Failed to reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <label
          htmlFor="password"
          className="text-dark mb-3 block text-sm dark:text-white"
        >
          New Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>
      <div className="mb-8">
        <label
          htmlFor="passwordConfirmation"
          className="text-dark mb-3 block text-sm dark:text-white"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          name="passwordConfirmation"
          placeholder="Confirm new password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>
      <div className="mb-6">
        <button
          type="submit"
          disabled={loading}
          className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
