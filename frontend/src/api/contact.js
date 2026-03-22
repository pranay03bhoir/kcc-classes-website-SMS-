import api from "@/utils/common-axios";

/**
 * Submit the contact page form; the backend stores the inquiry and emails the owner.
 */
export async function submitContactInquiry(payload) {
  console.log("Contact API payload:", payload);
  console.log("API base URL:", process.env.NEXT_PUBLIC_AXIOS_USER_URL || "Using fallback");
  
  try {
    const { data } = await api.post("/contact", payload);
    console.log("Contact API success response:", data);
    return data;
  } catch (error) {
    console.error("Contact API error:", error);
    console.error("API error details:", error.response?.data);
    throw error;
  }
}
