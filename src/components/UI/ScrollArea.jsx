import React from "react";
import { twMerge } from "tailwind-merge";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge("relative overflow-hidden", className)}
      {...props}
    >
      <div className="h-full w-full rounded-[inherit] overflow-auto">
        {children}
      </div>
      <ScrollBar />
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        "flex touch-none select-none transition-colors",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
          : "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <div className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400" />
    </div>
  );
});
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
