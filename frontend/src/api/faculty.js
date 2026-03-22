import api from "@/utils/common-axios";

/**
 * Public faculty list for the marketing site (from /api/common/get/faculty).
 */
export async function getPublicFaculty() {
  const { data } = await api.get("/get/faculty");
  return data.faculty;
}
