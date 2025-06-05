"use client";

import { Button } from "@/components/ui/button";

export const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Logout
        </h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to logout? You will need to login again to
          access your account.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
