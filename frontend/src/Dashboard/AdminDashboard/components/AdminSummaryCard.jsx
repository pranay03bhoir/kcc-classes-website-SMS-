import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const AdminSummaryCard = ({ icon, label, value, trend, trendUp, ...props }) => (
  <Card
    className="shadow-md rounded-2xl p-4 flex items-center gap-4"
    {...props}
  >
    <div className="text-2xl text-blue-600">{icon}</div>
    <CardContent className="p-0 flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{value}</h3>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            <span className="ml-1">{trend}</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default AdminSummaryCard;
