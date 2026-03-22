import StudentTestimonialForm from "@/Dashboard/StudentDashboard/StudentTestimonialForm";
import UpdateStudentDetails from "@/Dashboard/StudentDashboard/UpdateStudentDetails";

const page = () => {
  return (
    <div className="space-y-8">
      <UpdateStudentDetails />
      <StudentTestimonialForm />
    </div>
  );
};

export default page;
