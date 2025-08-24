// Simplified Chart Components for Smart Toilet Management System

import React from 'react';
import { cn } from '@/lib/utils';

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: any;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={cn('w-full h-full', className)} {...props}>
      {children}
    </div>
  );
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload = [], 
  label, 
  className 
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={cn(
      'rounded-lg border bg-background p-2 shadow-md',
      className
    )}>
      {label && (
        <p className="font-medium text-foreground mb-1">{label}</p>
      )}
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

interface ChartTooltipContentProps extends ChartTooltipProps {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = (props) => {
  return <ChartTooltip {...props} />;
};

interface ChartLegendProps {
  payload?: any[];
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ 
  payload = [], 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface ChartLegendContentProps extends ChartLegendProps {
  hideIcon?: boolean;
  nameKey?: string;
}

export const ChartLegendContent: React.FC<ChartLegendContentProps> = (props) => {
  return <ChartLegend {...props} />;
};

// Chart style utilities
export const ChartStyle = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--accent-success))',
  warning: 'hsl(var(--accent-warning))',
  danger: 'hsl(var(--accent-danger))',
};

// Export default config for easy use
export const defaultChartConfig = {
  primary: {
    theme: {
      light: ChartStyle.primary,
      dark: ChartStyle.primary,
    },
  },
  secondary: {
    theme: {
      light: ChartStyle.secondary,
      dark: ChartStyle.secondary,
    },
  },
};