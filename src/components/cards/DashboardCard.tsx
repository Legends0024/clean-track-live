import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DashboardCardProps } from '../../types';

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  onClick,
}) => {
  const isClickable = !!onClick;

  const cardContent = (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-accent-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-accent-danger" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-accent-success' : 'text-accent-danger'
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const cardClasses = cn(
    'card-glass rounded-2xl transition-all duration-300',
    'hover:shadow-lg hover:scale-[1.02]',
    isClickable && 'cursor-pointer hover:bg-card-hover',
    className
  );

  if (isClickable) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {cardContent}
    </motion.div>
  );
};

export default DashboardCard;