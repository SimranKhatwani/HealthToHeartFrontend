import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useSelector } from "react-redux";

const buttonSizes = {
  default: "h-10 px-2 py-2",
  sm: "h-9 px-2",
  lg: "h-11 px-8",
  icon: "h-10 w-10 flex items-center justify-center"
};

const Button = forwardRef(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    const Component = asChild ? "span" : "button";
    const { mode } = useSelector((state) => state.theme);

    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      default:
        mode === "dark"
          ? "bg-teal-900 hover:bg-teal-800 text-black"
          : "bg-[#0fb3af] hover:bg-[#00a19d] text-white",

      destructive:
        mode === "dark"
          ? "bg-red-800 hover:bg-red-700 text-white"
          : "bg-red-500 hover:bg-red-600 text-white",

      outline:
        mode === "dark"
          ? "border border-gray-600 bg-black text-white hover:bg-gray-900"
          : "border border-gray-300 text-black hover:bg-gray-100",

      secondary:
        mode === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-gray-500 hover:bg-gray-600 text-white",

      ghost:
        mode === "dark"
          ? "bg-transparent text-white hover:bg-gray-800"
          : "bg-transparent text-black hover:bg-gray-100",

      link:
        mode === "dark"
          ? "text-blue-400 underline hover:text-blue-300"
          : "text-blue-500 underline hover:text-blue-700"
    };

    return (
      <Component
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "secondary", "ghost", "link"]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  asChild: PropTypes.bool,
  children: PropTypes.node
};

export default Button;
