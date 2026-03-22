import api from "@/utils/common-axios";

/**
 * Submit the student registration form; the backend saves the lead and emails the owner.
 */
export async function submitStudentRegistration(payload) {
  const { data } = await api.post("/registration", payload);
  return data;
}
