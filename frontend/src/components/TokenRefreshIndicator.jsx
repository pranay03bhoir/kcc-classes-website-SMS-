"use client";

import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { FaSync } from "react-icons/fa";

const TokenRefreshIndicator = () => {
  const { isRefreshing } = useAuth();

  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <FaSync className="animate-spin" />
          <span className="text-sm font-medium">Refreshing session...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TokenRefreshIndicator;
