"use client";

import type React from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  toggle,
  className = "",
}) => {
  return (
    <button
      onClick={toggle}
      className={`relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none ${className}`}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
    >
      <span
        className={`block w-6 h-0.5 bg-primary transition-all duration-300 ease-out ${
          isOpen ? "absolute rotate-45" : "mb-1.5"
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-primary transition-all duration-300 ease-out ${
          isOpen ? "opacity-0" : "mb-1.5"
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-primary transition-all duration-300 ease-out ${
          isOpen ? "absolute -rotate-45" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
