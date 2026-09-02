import React from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from 'react-i18next';

const Avatar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <img
      ref={ref}
      className={twMerge("aspect-square h-full w-full object-cover", className)}
      {...props}
      alt={t('translation:avatar')}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-200",
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
