"use client";

import { useState, useEffect } from "react";
import { useSnackbar } from "@/components/Common/SnackbarProvider";
import { requestPasswordReset } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const { showMessage } = useSnackbar();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer logic to restrain resending email for 3 minutes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
      setTimer(180); // 3 minutes
      showMessage("Password reset link sent to your email!", "success");
    } catch (error: any) {
      showMessage(error.message || "Failed to send reset link.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div className="mb-8 flex items-center rounded-md border border-green-200 bg-green-50 px-4 py-3">
          <svg
            className="mr-3 h-6 w-6 flex-shrink-0 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="white"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span className="text-base text-green-700">
            Password reset link sent! Please check your email.
          </span>
        </div>
      )}

      <div className="mb-8">
        <label
          htmlFor="email"
          className="text-dark mb-3 block text-sm dark:text-white"
        >
          Your Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={email}
          onChange={handleChange}
          required
          disabled={timer > 0}
          className={`border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none ${
            timer > 0 ? "cursor-not-allowed opacity-60" : ""
          }`}
        />
      </div>

      <div className="mb-6">
        <button
          type="submit"
          disabled={loading || timer > 0}
          className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : timer > 0
              ? `Resend in ${Math.floor(timer / 60)
                  .toString()
                  .padStart(1, "0")}:${(timer % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "Send Reset Link"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
