import api from "@/utils/common-axios";

/**
 * Submit the contact page form; the backend stores the inquiry and emails the owner.
 */
export async function submitContactInquiry(payload) {
  console.log("Contact API call started");
  console.log("Payload:", payload);
  console.log("API base URL:", api.defaults.baseURL);
  
  try {
    const { data } = await api.post("/contact", payload);
    console.log("Contact API success:", data);
    return data;
  } catch (error) {
    console.error("Contact API error:", error);
    console.error("Error config:", error.config);
    console.error("Error request:", error.request);
    console.error("Error response:", error.response);
    throw error;
  }
}
