// Simple connectivity test
import api from "@/utils/common-axios";

export async function testConnectivity() {
  try {
    const response = await api.get("/auth/check");
    return { success: true, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      status: error.response?.status
    };
  }
}
