
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePerformanceData } from '@/hooks/usePerformanceData.js';
import Header from '@/components/Header.jsx';
import KPICard from '@/components/KPICard.jsx';
import TrendChart from '@/components/TrendChart.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Loader2, Activity } from 'lucide-react';

const MyPerformancePage = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState('daily');
  const { data, summary, loading, error } = usePerformanceData(currentUser?.id, view);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <p className="text-destructive">Failed to load performance data.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Performance - Future Designz</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Activity className="w-8 h-8 mr-3 text-primary" />
                My Performance
              </h1>
              <p className="text-muted-foreground mt-1">Track your productivity and task completion trends</p>
            </div>
            
            <div className="bg-card p-1 rounded-lg border border-border shadow-sm">
              <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}>
                <ToggleGroupItem value="daily" aria-label="Daily view">Daily</ToggleGroupItem>
                <ToggleGroupItem value="weekly" aria-label="Weekly view">Weekly</ToggleGroupItem>
                <ToggleGroupItem value="monthly" aria-label="Monthly view">Monthly</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KPICard 
              title="Total Tasks (All Time)" 
              value={summary.tasks} 
            />
            <KPICard 
              title="Total Hours (All Time)" 
              value={summary.hours.toFixed(1)} 
              suffix="h"
            />
            <KPICard 
              title="Avg Completion Rate" 
              value={summary.completionRate} 
              suffix="%"
              trend={summary.completionRate >= 80 ? 5 : summary.completionRate < 50 ? -5 : 0} // Mock trend for visual
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Productivity Trend ({view})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <TrendChart 
                    data={data} 
                    type="area" 
                    dataKey1="hours" 
                    dataKey2="tasks" 
                    name1="Hours Logged" 
                    name2="Tasks Submitted" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Completion Rate Trend ({view})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <TrendChart 
                    data={data} 
                    type="bar" 
                    dataKey1="completionRate" 
                    name1="Completion Rate (%)" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPerformancePage;
