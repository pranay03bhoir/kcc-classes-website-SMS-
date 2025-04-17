import React from "react";
import { FaGreaterThan } from "react-icons/fa";

const Departments = ({ title, grades, subjects, id, textColor, bgColor }) => {
  return (
    <div
      className={`${bgColor} p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300`}
    >
      <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
      <p className="text-gray-600 text-lg mt-1">{grades}</p>

      <ul className="mt-4 space-y-2">
        {subjects.map((subject) => (
          <li key={id} className={`flex items-center ${textColor} text-lg`}>
            <FaGreaterThan className="w-5 h-5 mr-2" />
            {subject}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Departments;
