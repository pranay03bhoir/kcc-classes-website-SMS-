"use client";

import api from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useLogout = (redirectPath) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    try {
      const response = await api.post("/logout");
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Logged out successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        window.location.href = redirectPath;
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};
