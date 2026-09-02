import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useSelector } from "react-redux";

// Tabs Root
const Tabs = TabsPrimitive.Root;

// Tabs List
const TabsList = React.forwardRef(({ className = "", ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={`flex flex-wrap sm:flex-nowrap sm:overflow-x-auto h-auto sm:h-10 items-center justify-start sm:justify-center gap-1 sm:gap-2 rounded-md
        ${mode === "dark" ? "bg-teal-950 text-gray-300" : "bg-gray-200 text-gray-500"} ${className}`}
      {...props}
    />
  );
});

const TabsTrigger = React.forwardRef(({ className = "", ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm 
        px-2 sm:px-3 py-1 sm:py-[6px] text-sm sm:text-base font-medium transition-all focus:outline-none disabled:opacity-50
        ${
          mode === "dark"
            ? "data-[state=active]:bg-teal-900 data-[state=active]:text-black text-gray-300"
            : "data-[state=active]:bg-[#0fb3af] data-[state=active]:text-black text-gray-500"
        } ${className}`}
      {...props}
    />
  );
});



TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Tabs Content
const TabsContent = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`mt-2 ring-offset-background focus:outline-none focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Export all components individually
export { Tabs, TabsContent, TabsList, TabsTrigger };
