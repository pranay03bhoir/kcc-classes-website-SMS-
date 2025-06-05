"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export const SidebarItem = ({ item, isOpen, isActive, onMobileClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={`flex items-center gap-5 px-4 py-3 rounded-lg transition-all duration-200 
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
              }
              ${!isOpen && "justify-center px-2"}
            `}
            onClick={onMobileClick}
          >
            <span
              className={`text-lg ${isActive ? "text-white" : "text-gray-400"}`}
            >
              {item.icon}
            </span>
            <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
              {item.label}
            </span>
          </Link>
        </TooltipTrigger>
        {!isOpen && (
          <TooltipContent side="right" className="bg-gray-800 text-white">
            <p>{item.label}</p>
            <p className="text-xs text-gray-400">{item.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
