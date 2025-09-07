"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { useSnackbar } from "@/components/Common/SnackbarProvider";
import { sendVerifyEmail } from "@/lib/api/auth";

const SigninForm = () => {
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Only send email and password to the API
      const response = await loginUser({
        identifier: formData.email,
        password: formData.password,
      });

      // Store token based on rememberMe
      if (response && response.jwt) {
        if (formData.rememberMe) {
          localStorage.setItem("token", response.jwt);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", response.jwt);
          localStorage.removeItem("token");
        }
      }

      showMessage("Login successful!", "success");
      router.push("/");
    } catch (error: any) {
      if (error.message == "Your account email is not confirmed") {
        await sendVerifyEmail(formData.email);
        showMessage(
          "Verification email sent! Please check your inbox.",
          "success",
        );
        setLoading(false);
        return;
      }
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          value={formData.email}
          onChange={handleChange}
          required
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>

      <div className="mb-8">
        <label
          htmlFor="password"
          className="text-dark mb-3 block text-sm dark:text-white"
        >
          Your Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <label className="text-dark flex items-center text-sm dark:text-white">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="mr-2"
          />
          Remember me
        </label>
        <a
          href="/auth/forgotpassword"
          className="text-primary text-sm hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <div className="mb-6">
        <button
          type="submit"
          disabled={loading}
          className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default SigninForm;
