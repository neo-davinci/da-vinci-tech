"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magic/animated-grid-pattern";
import { getIcon } from "@/components/icons";

export interface HeroSectionProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Uppercase label above the title */
  label?: string;
  /** Main hero title */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon name to resolve via getIcon() */
  iconName?: string;
  /** Grid pattern numSquares prop */
  gridSquares?: number;
  /** Grid pattern maxOpacity prop */
  gridMaxOpacity?: number;
  /** Grid pattern duration prop */
  gridDuration?: number;
  /** Grid pattern repeatDelay prop */
  gridRepeatDelay?: number;
  /** Additional grid pattern className */
  gridClassName?: string;
}

function HeroSection({
  label,
  title,
  description,
  iconName,
  gridSquares = 30,
  gridMaxOpacity = 0.2,
  gridDuration = 6,
  gridRepeatDelay = 0.8,
  gridClassName,
  className,
  children,
  ...props
}: HeroSectionProps) {
  const Icon = iconName ? getIcon(iconName) : null;

  return (
    <div
      data-slot="hero-section"
      className={cn(
        "relative border-b border-border/50 bg-gradient-to-b from-muted/20 to-background overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="hero-ambient-glow pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <AnimatedGridPattern
        numSquares={gridSquares}
        maxOpacity={gridMaxOpacity}
        duration={gridDuration}
        repeatDelay={gridRepeatDelay}
        className={cn("opacity-20", gridClassName)}
      />

      <div className="hero-scanlines pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      <div className="relative z-10 px-6 py-10">
        {label && (
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="h-5 w-5 text-emerald-500" />}
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
          </div>
        )}
        {title && (
          <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
        )}
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {children && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export { HeroSection };
