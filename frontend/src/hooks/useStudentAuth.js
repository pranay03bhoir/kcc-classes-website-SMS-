import api from "@/utils/student-axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useStudentAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/get/student/details");
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh token
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setIsAuthenticated(false);
          setUser(null);
          router.push("/login/student");
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await api.post("/refresh");
      if (response.data.success) {
        setIsAuthenticated(true);
        // Re-fetch user details after successful refresh
        const userResponse = await api.get("/get/student/details");
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login/student");
    }
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    isRefreshing,
    user,
    checkAuthStatus,
    refreshToken,
    logout,
  };
};
