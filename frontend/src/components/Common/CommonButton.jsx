import React from "react";
import clsx from "clsx";

export default function CommonButton({ icon: Icon, label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap",
        className
      )}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}
