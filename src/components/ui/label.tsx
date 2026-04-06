"use client";

import { Label as LabelPrimitive } from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<"label"> {
  className?: string;
}

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[-disabled=true]:pointer-events-none group-data-[-disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
