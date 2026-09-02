import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// Dialog Overlay
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/80 transition-opacity ${className}`}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Dialog Content
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { t } = useTranslation();
  const { mode } = useSelector((state) => state.theme);

  const isDark = mode === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-gray-700" : "border";

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg ${borderColor} 
          ${bgColor} p-6 shadow-lg transition-all duration-200 ${textColor} ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={`absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 
            focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColor}`}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">{t('translation:close')}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Dialog Header
const DialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

// Dialog Footer
const DialogFooter = ({ className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

// Dialog Title
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);
  const textColor = mode === "dark" ? "text-white" : "text-black";

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${textColor} ${className}`}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Dialog Description
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { mode } = useSelector((state) => state.theme);
  const descColor = mode === "dark" ? "text-gray-300" : "text-gray-500";

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`text-sm ${descColor} ${className}`}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
