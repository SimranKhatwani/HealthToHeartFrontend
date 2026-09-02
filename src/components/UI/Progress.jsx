import React, { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = forwardRef(({ className, value, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-teal-500 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export default Progress;
