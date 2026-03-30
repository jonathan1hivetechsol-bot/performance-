
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DailyLogForm from '@/components/DailyLogForm.jsx';
import EmployeeLogsView from '@/components/EmployeeLogsView.jsx';
import Header from '@/components/Header.jsx';
import { format } from 'date-fns';
import { ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    totalToday: 0,
    completedToday: 0
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('daily_logs').getList(1, 100, {
        filter: `employee_id="${currentUser.id}"`,
        sort: '-date_submitted',
        $autoCancel: false
      });
      
      setLogs(records.items);
      
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = records.items.filter(log => log.date_submitted === today);
      const completedTodayLogs = todayLogs.filter(log => log.status === 'Complete');
      
      setTodayStats({
        totalToday: todayLogs.length,
        completedToday: completedTodayLogs.length
      });
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentUser.id]);

  const handleLogSuccess = () => {
    fetchLogs();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Dashboard - ${currentUser.name}`}</title>
        <meta name="description" content="View your daily work logs and submit new tasks" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks submitted today</CardTitle>
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{todayStats.totalToday}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Track your daily productivity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed tasks today</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{todayStats.completedToday}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {todayStats.totalToday > 0 
                    ? `${Math.round((todayStats.completedToday / todayStats.totalToday) * 100)}% completion rate`
                    : 'No tasks submitted yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <DailyLogForm onSuccess={handleLogSuccess} />
          </div>

          <div>
            <EmployeeLogsView logs={logs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
