import api from "@/utils/common-axios";

/** Approved student testimonials for the public site (home carousel). */
export async function getPublicTestimonials() {
  const { data } = await api.get("/get/testimonials", {
    withCredentials: false,
  });
  const list = data?.testimonials;
  return Array.isArray(list) ? list : [];
}
