
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTeamKPIs } from '@/hooks/useTeamKPIs.js';
import { useDepartmentMetrics } from '@/hooks/useDepartmentMetrics.js';
import Header from '@/components/Header.jsx';
import KPICard from '@/components/KPICard.jsx';
import DepartmentCard from '@/components/DepartmentCard.jsx';
import TrendChart from '@/components/TrendChart.jsx';
import KPIExportButton from '@/components/KPIExportButton.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PieChart, Trophy, AlertCircle } from 'lucide-react';

const KPIDashboard = () => {
  const { currentUser } = useAuth();
  
  const { kpis, loading: kpiLoading, error: kpiError } = useTeamKPIs(currentUser?.id);
  const { metrics: deptMetrics, loading: deptLoading, error: deptError } = useDepartmentMetrics(currentUser?.id);
  
  const loading = kpiLoading || deptLoading;
  const error = kpiError || deptError;

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Please log in to view the KPI dashboard.</p>
        </div>
      </>
    );
  }

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
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Card className="max-w-md w-full border-destructive/50 shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load KPIs</h2>
              <p className="text-muted-foreground">There was an error fetching the dashboard data.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const topDept = deptMetrics && deptMetrics.length > 0 ? deptMetrics[0] : null;

  return (
    <>
      <Helmet>
        <title>KPI Dashboard - Future Designz</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <PieChart className="w-8 h-8 mr-3 text-primary" />
                KPI Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Real-time team performance metrics and insights</p>
            </div>
            
            <KPIExportButton kpiData={kpis} departmentData={deptMetrics} />
          </div>

          {/* Overall Company/Team KPIs */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Today's Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Tasks Submitted" 
                value={kpis?.today?.tasks || 0} 
                trend={kpis?.trends?.tasks} 
              />
              <KPICard 
                title="Hours Logged" 
                value={kpis?.today?.hours?.toFixed(1) || 0} 
                suffix="h"
                trend={kpis?.trends?.hours} 
              />
              <KPICard 
                title="Completion Rate" 
                value={kpis?.today?.completionRate || 0} 
                suffix="%"
                trend={kpis?.trends?.completionRate} 
              />
              <KPICard 
                title="Avg Hours / Employee" 
                value={kpis?.today?.avgHoursPerEmployee || 0} 
                suffix="h"
                trend={kpis?.trends?.avgHours} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Top Performer Highlight */}
            <div className="lg:col-span-1">
              <Card className="h-full bg-gradient-to-br from-primary/10 to-background border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Trophy className="w-5 h-5 mr-2" />
                    Top Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topDept ? (
                    <div className="text-center py-6">
                      <h3 className="text-3xl font-bold text-foreground mb-2">{topDept.name}</h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success font-semibold text-sm mb-6">
                        {topDept.completionRate}% Completion Rate
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-background/50 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Tasks</p>
                          <p className="font-semibold">{topDept.tasks}</p>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Avg Hours</p>
                          <p className="font-semibold">{topDept.avgHours}h</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No department data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Department Comparison Chart */}
            <div className="lg:col-span-2">
              <Card className="h-full border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Department Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <TrendChart 
                      data={deptMetrics || []} 
                      type="bar" 
                      dataKey1="completionRate" 
                      dataKey2="avgHours" 
                      name1="Completion Rate (%)" 
                      name2="Avg Hours" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Department Breakdown Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Department Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptMetrics && deptMetrics.length > 0 ? (
                deptMetrics.map((dept, index) => (
                  <DepartmentCard key={index} department={dept} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full">No department data available.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default KPIDashboard;
