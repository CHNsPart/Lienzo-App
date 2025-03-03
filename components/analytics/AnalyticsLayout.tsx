"use client"

import React from "react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  description,
  children,
  className,
}: AnalyticsCardProps) {
  return (
    <div className={cn("col-span-4 rounded-lg border bg-card/60 p-6", className)}>
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsLayout({ children, className }: AnalyticsLayoutProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-8 lg:grid-cols-12", className)}>
      {children}
    </div>
  );
}