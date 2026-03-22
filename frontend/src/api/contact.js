import api from "@/utils/common-axios";

/**
 * Submit the contact page form; the backend stores the inquiry and emails the owner.
 */
export async function submitContactInquiry(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}
