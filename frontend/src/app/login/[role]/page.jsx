
import LoginForm from "@/components/LoginComponent/login/LoginForm";
import { notFound } from "next/navigation";

export default async function Login({ params }) {
  const roleParam = params?.role;

  if (!roleParam) notFound();

  const role = roleParam.toLowerCase();
  const validRoles = ["student", "teacher", "admin"];

  if (!validRoles.includes(role)) {
    notFound();
  }

  return (
    <div>
      <LoginForm role={role} />
    </div>
  );
}
