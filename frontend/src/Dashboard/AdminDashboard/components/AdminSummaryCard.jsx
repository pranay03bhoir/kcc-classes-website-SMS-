import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminSummaryCard = ({ icon, label, value, trend, trendUp, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.045, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative ${className}`}
  >
    <Card
      className="bg-white/70 backdrop-blur-md border-0 shadow-xl rounded-2xl p-6 flex items-center gap-5 min-h-[120px] transition-all"
      {...props}
    >
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-400/80 to-teal-400/80 shadow-lg">
        <span className="text-3xl">{icon}</span>
      </div>
      <CardContent className="p-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">{label}</p>
        <div className="flex items-end justify-between">
          <motion.h3
            className="text-3xl font-extrabold text-gray-800 drop-shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.h3>
          {trend && (
            <span
              className={`ml-2 flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-sm bg-white/80 border border-gray-200 ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default AdminSummaryCard;
