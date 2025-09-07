import { StrapiAuthResponse } from "@/types/auth";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<StrapiAuthResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result: StrapiAuthResponse | { message: string } = await res.json();

  if (!res.ok) {
    throw new Error(
      (result as { message: string }).message || "Registration failed",
    );
  }

  // ✅ Store JWT in localStorage
  console.log("result; " + result);
  if (typeof window !== "undefined" && "jwt" in result) {
    localStorage.setItem("token", result.jwt);
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result as StrapiAuthResponse;
}

/**
 * Login user
 */
export const loginUser = async (formData: {
  identifier: string; // can be username OR email
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Login failed");
  }

  // Save token + user
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // optional if you store user info
    sessionStorage.removeItem("token"); // optional if you store user info
  }
};

/**
 * Request password reset link
 */
export const requestPasswordReset = async (email: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to send reset link");
  }

  return data;
};

/**
 * Reset password using code from email
 */
export const resetPassword = async ({
  code,
  password,
  passwordConfirmation,
}: {
  code: string;
  password: string;
  passwordConfirmation: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to reset password");
  }

  // Optionally store new token/user if returned
  if (typeof window !== "undefined" && data.jwt && data.user) {
    sessionStorage.setItem("token", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * Send email verification (confirmation) link to user
 */
export const sendVerifyEmail = async (email: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-email-confirmation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error?.message || "Failed to send verification email",
    );
  }

  return data;
};
