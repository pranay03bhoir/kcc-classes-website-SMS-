import { Card, CardContent } from "@/components/ui/card";

const AdminSummaryCard = ({ icon, label, value, ...props }) => (
  <Card
    className="shadow-md rounded-2xl p-4 flex items-center gap-4"
    {...props}
  >
    <div className="text-2xl text-blue-600">{icon}</div>
    <CardContent className="p-0">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </CardContent>
  </Card>
);
export default AdminSummaryCard;
