"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";

export const SidebarItem = ({
  item,
  isOpen,
  isActive,
  isLoading,
  onMobileClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={`flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:py-2 lg:py-2.5 rounded-md transition-all duration-200 
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              }
              ${!isOpen && "justify-center px-1.5 sm:px-2"}
            `}
            onClick={onMobileClick}
          >
            <span
              className={`text-sm sm:text-base lg:text-lg ${
                isActive ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : item.icon}
            </span>
            <span
              className={`${
                isOpen ? "block" : "hidden"
              } text-xs sm:text-sm lg:text-base font-medium`}
            >
              {item.label}
            </span>
          </Link>
        </TooltipTrigger>
        {!isOpen && (
          <TooltipContent
            side="right"
            className="bg-white text-gray-700 border border-gray-100 shadow-sm p-2 sm:p-2.5 lg:p-3"
            sideOffset={5}
          >
            <p className="text-xs sm:text-sm lg:text-base font-medium">
              {item.label}
            </p>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {item.description}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
