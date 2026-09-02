import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useSelector } from "react-redux";

export const Card = forwardRef(({ className, ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-lg border shadow-sm transition-colors",
        mode === "dark"
          ? "bg-gray-850 text-gray-100 border-gray-800"
          : "bg-white text-gray-800 border-gray-200",
        className
      )}
      {...props}
    />
  );
});

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

export const CardDescription = forwardRef(({ className, ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);
  return (
    <div
      ref={ref}
      className={clsx(
        "text-sm",
        mode === "dark" ? "text-teal-200" : "text-gray-500",
        className
      )}
      {...props}
    />
  );
});

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
));

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("flex items-center p-6 pt-0", className)} {...props} />
));

// Display names for better debugging
Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

// PropTypes validation
const propTypes = {
  className: PropTypes.string,
};

Card.propTypes = propTypes;
CardHeader.propTypes = propTypes;
CardTitle.propTypes = propTypes;
CardDescription.propTypes = propTypes;
CardContent.propTypes = propTypes;
CardFooter.propTypes = propTypes;
