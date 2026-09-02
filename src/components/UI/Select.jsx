import React, { useState, isValidElement } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

// Select Trigger
const SelectTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 cursor-pointer transition"
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Select Content with Search
const SelectContent = React.forwardRef(({ children, ...props }, ref) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredChildren = React.Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const label = child.props.children?.toString().toLowerCase();
    if (label?.includes(search.toLowerCase())) return child;
    return null;
  });

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className="z-50 w-[var(--radix-select-trigger-width)] max-h-60 rounded-md border bg-white shadow-md overflow-hidden"
        sideOffset={4}
        position="popper"
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 hover:bg-gray-100">
          <ChevronUp className="w-4 h-4 text-gray-500" />
        </SelectPrimitive.ScrollUpButton>

        <div className="border-b p-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('translation:search')}
            className="w-full px-3 py-1.5 text-sm outline-none border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <SelectPrimitive.Viewport className="p-1">
          {filteredChildren?.length > 0 ? (
            filteredChildren
          ) : (
            <div className="text-sm text-gray-500 px-3 py-2">{t('translation:noResultsFound')}</div>
          )}
        </SelectPrimitive.Viewport>

        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 hover:bg-gray-100">
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Select Item
const SelectItem = React.forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition"
    {...props}
  >
    <SelectPrimitive.ItemIndicator>
      <Check className="w-4 h-4 text-green-500" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Additional components
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;
const Select = SelectPrimitive.Root;

// Export all components
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator
};