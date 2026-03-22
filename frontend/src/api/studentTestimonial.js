import studentApi from "@/utils/student-axios";

export async function getMyTestimonial() {
  const { data } = await studentApi.get("/testimonial/me");
  return data;
}

export async function saveTestimonial(payload) {
  const { data } = await studentApi.post("/testimonial", payload);
  return data;
}
