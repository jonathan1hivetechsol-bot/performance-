
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, CheckCircle2 } from 'lucide-react';

const DepartmentCard = ({ department }) => {
  const { name, completionRate, avgHours, employeeCount } = department;

  const getStatusColor = (rate) => {
    if (rate >= 80) return 'text-[hsl(var(--success))] bg-[hsl(var(--success)_/_0.1)]';
    if (rate >= 50) return 'text-[hsl(var(--warning))] bg-[hsl(var(--warning)_/_0.1)]';
    return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)_/_0.1)]';
  };

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-foreground text-lg">{name}</h4>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(completionRate)}`}>
            {completionRate}% Done
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-muted rounded-md">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Hours</p>
              <p className="font-medium text-foreground">{avgHours}h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-muted rounded-md">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Team Size</p>
              <p className="font-medium text-foreground">{employeeCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
