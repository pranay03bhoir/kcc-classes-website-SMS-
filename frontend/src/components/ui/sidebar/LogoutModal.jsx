"use client";

import { Button } from "@/components/ui/button";

export const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 lg:p-5">
      <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 max-w-[280px] sm:max-w-sm w-full border border-gray-100 shadow-sm">
        <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
          Confirm Logout
        </h3>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-5">
          Are you sure you want to logout? You will need to login again to
          access your account.
        </p>
        <div className="flex justify-end gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs sm:text-sm lg:text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2"
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-xs sm:text-sm lg:text-base text-red-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
