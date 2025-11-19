import React from "react";
import { NavLink } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function MapDropdown({ tripId }) {
  return (
    <div className="relative group">
      <button className="text-gray-500 hover:text-blue-600 transition">
        <FaMapMarkedAlt className="text-xl" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
        {/* Use tripId in the NavLink */}
        <NavLink
          to={tripId ? `/trip/${tripId}/map` : "/map"}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Trip Map
        </NavLink>
        <NavLink
          to="/explore"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Explore Map
        </NavLink>
      </div>
    </div>
  );
}




