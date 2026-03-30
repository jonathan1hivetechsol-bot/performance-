
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const KPICard = ({ title, value, trend, suffix = '', prefix = '', inverseGood = false }) => {
  // Determine status based on trend
  let status = 'average';
  if (trend > 0) {
    status = inverseGood ? 'poor' : 'good';
  } else if (trend < 0) {
    status = inverseGood ? 'good' : 'poor';
  }

  const getStatusClass = () => {
    if (status === 'good') return 'kpi-good';
    if (status === 'poor') return 'kpi-poor';
    return 'kpi-average';
  };

  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline space-x-1">
            <h3 className="text-3xl font-bold text-foreground tracking-tight">
              {prefix}{value}{suffix}
            </h3>
          </div>
          
          {trend !== undefined && (
            <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusClass()}`}>
              <TrendIcon className="w-3 h-3 mr-1" />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
