// Simple connectivity test
import api from "@/utils/common-axios";

export async function testConnectivity() {
  console.log("Testing API connectivity...");
  
  try {
    const response = await api.get("/auth/check");
    console.log("Connectivity test successful:", response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error("Connectivity test failed:", error);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      status: error.response?.status
    };
  }
}
