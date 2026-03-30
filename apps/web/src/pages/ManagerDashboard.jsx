
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Loader2, AlertCircle } from 'lucide-react';

const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamLogs, setTeamLogs] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [topPerformer, setTopPerformer] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch daily logs for the manager's team
        const records = await pb.collection('daily_logs').getList(1, 500, {
          filter: `manager_id="${currentUser.id}"`,
          sort: '-date_submitted',
          $autoCancel: false
        });

        setTeamLogs(records.items);

        // Fetch all users once to create a lookup map (avoids N+1 queries and 404s on deleted users)
        let userMap = {};
        try {
          const users = await pb.collection('users').getFullList({ $autoCancel: false });
          users.forEach(u => {
            userMap[u.id] = u.name;
          });
        } catch (err) {
          console.warn('Failed to fetch users for mapping:', handlePocketBaseError(err));
          // Continue even if user fetch fails, we'll fallback to 'Unknown Employee'
        }

        const statusCounts = {
          Complete: 0,
          'In Progress': 0,
          Pending: 0
        };

        const employeeStats = {};

        records.items.forEach(log => {
          statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;

          if (!employeeStats[log.employee_id]) {
            employeeStats[log.employee_id] = {
              id: log.employee_id,
              taskCount: 0,
              totalHours: 0
            };
          }
          employeeStats[log.employee_id].taskCount += 1;
          employeeStats[log.employee_id].totalHours += log.hours_spent;
        });

        const statusChartData = [
          { name: 'Complete', value: statusCounts.Complete, color: '#22c55e' },
          { name: 'In Progress', value: statusCounts['In Progress'], color: '#eab308' },
          { name: 'Pending', value: statusCounts.Pending, color: '#94a3b8' }
        ];
        setStatusData(statusChartData);

        // Aggregate employee data using the bulk user map
        const employeeChartData = Object.values(employeeStats).map(emp => ({
          name: userMap[emp.id] || 'Unknown Employee',
          tasks: emp.taskCount,
          hours: emp.totalHours
        }));

        setEmployeeData(employeeChartData);

        if (employeeChartData.length > 0) {
          const top = employeeChartData.reduce((prev, current) => 
            (prev.hours > current.hours) ? prev : current
          );
          if (top.name !== 'Unknown Employee') {
            setTopPerformer(top);
          }
        }
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        setError(handlePocketBaseError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [currentUser?.id]);

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Please log in to view the dashboard.</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
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
              <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load dashboard</h2>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0);
  const completionRate = totalTasks > 0 ? Math.round((statusData[0]?.value / totalTasks) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{`Manager Dashboard - ${currentUser?.name || 'Loading'}`}</title>
        <meta name="description" content="View team performance analytics and activity" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Manager dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome, {currentUser?.name} {currentUser?.department ? `- ${currentUser.department}` : ''}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Team activity summary</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task completion rate</CardTitle>
                  <CardDescription>Distribution of task statuses across your team</CardDescription>
                </CardHeader>
                <CardContent>
                  {totalTasks > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-4">
                        <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                        <p className="text-sm text-muted-foreground">Overall completion rate</p>
                      </div>
                    </>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">No team activity data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team activity</CardTitle>
                  <CardDescription>Task count per team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={employeeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tasks" fill="hsl(var(--primary))" name="Tasks" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">No employee activity data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {topPerformer && (
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <CardTitle>Top performer</CardTitle>
                  </div>
                  <CardDescription>Team member with the most hours logged</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{topPerformer.name}</p>
                      <p className="text-muted-foreground mt-1">
                        {topPerformer.tasks} tasks • {topPerformer.hours.toFixed(1)} hours
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
