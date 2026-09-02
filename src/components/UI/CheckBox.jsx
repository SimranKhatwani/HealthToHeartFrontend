import React from "react";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        ref={ref}
        className={twMerge(
          "peer hidden",
          className
        )}
        {...props}
      />
      <div
        className={twMerge(
          "h-4 w-4 rounded-sm border border-primary bg-white ring-offset-background",
          "peer-checked:bg-primary peer-checked:text-primary-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {props.checked && (
          <div className="flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
