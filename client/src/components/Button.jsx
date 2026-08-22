import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded tracking-wider uppercase",
    md: "px-6 py-2.5 text-sm rounded tracking-wide",
    lg: "px-8 py-3.5 text-base rounded tracking-wide",
    pill: "px-6 py-2 text-sm rounded-full tracking-wide",
  };

  const variantStyles = {
    primary:
      "bg-[#202525] text-[#F7F4EE] border border-[#202525] hover:bg-[#333130] focus:ring-[#202525]",
    terracotta:
      "bg-[#163A3D] text-[#FFFFFF] border border-[#163A3D] hover:bg-[#204F53] focus:ring-[#163A3D]",
    forest:
      "bg-[#D8E3D5] text-[#FFFFFF] border border-[#D8E3D5] hover:bg-[#2E4632] focus:ring-[#D8E3D5]",
    outline:
      "bg-transparent text-[#202525] border border-[#CBD5D6] hover:border-[#202525] hover:bg-[#F6F3F2] focus:ring-[#CBD5D6]",
    outlineTerracotta:
      "bg-transparent text-[#163A3D] border border-[#CBD5D6] hover:border-[#163A3D] hover:bg-[#FFDBC9]/30 focus:ring-[#163A3D]",
    ghost:
      "bg-transparent text-[#202525] hover:bg-[#EDE7DF] border-transparent focus:ring-transparent",
    danger:
      "bg-[#BA1A1A] text-white border border-[#BA1A1A] hover:bg-[#93000A] focus:ring-[#BA1A1A]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
