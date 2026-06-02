import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn(
    "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.06)] dark:shadow-none transition-all duration-300 hover:shadow-md", 
    className
  )}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 border-b border-border/30 dark:border-border/50", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h3 className={cn("text-lg font-bold tracking-tight text-foreground uppercase text-[13px] tracking-[0.05em]", className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <p className={cn("text-sm text-muted-foreground font-medium", className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("p-6 text-foreground", className)}>
    {children}
  </div>
);
