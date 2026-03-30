
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import FilterBar from '@/components/FilterBar.jsx';
import ExportButton from '@/components/ExportButton.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, TrendingUp, Clock, CheckCircle2, Users } from 'lucide-react';

const ReportsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: 'all'
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users (managers can see all or just their team depending on rules, assuming all for reports here)
        const usersRecords = await pb.collection('users').getFullList({ $autoCancel: false });
        setUsers(usersRecords);
        
        const depts = [...new Set(usersRecords.map(u => u.department).filter(Boolean))];
        setDepartments(depts);

        // Fetch all logs
        const logsRecords = await pb.collection('daily_logs').getFullList({ $autoCancel: false });
        setLogs(logsRecords);

      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const filteredLogs = useMemo(() => {
    let result = [...logs];
    
    if (filters.startDate) {
      result = result.filter(log => log.date_submitted >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter(log => log.date_submitted <= filters.endDate);
    }
    if (filters.department && filters.department !== 'all') {
      // Need to join with user to get department if log doesn't have it reliably, 
      // but log has department field. Let's use log's department.
      result = result.filter(log => log.department === filters.department);
    }
    
    return result;
  }, [logs, filters]);

  // Calculate Summary Stats
  const summaryStats = useMemo(() => {
    const totalTasks = filteredLogs.length;
    const totalHours = filteredLogs.reduce((sum, log) => sum + log.hours_spent, 0);
    const completedTasks = filteredLogs.filter(log => log.status === 'Complete').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Unique active employees in this period
    const activeEmployeeIds = new Set(filteredLogs.map(log => log.employee_id));
    
    return { totalTasks, totalHours, completionRate, activeEmployees: activeEmployeeIds.size };
  }, [filteredLogs]);

  // Department Performance Data
  const deptData = useMemo(() => {
    const deptMap = {};
    filteredLogs.forEach(log => {
      const dept = log.department || 'Unassigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, hours: 0, tasks: 0, completed: 0 };
      }
      deptMap[dept].hours += log.hours_spent;
      deptMap[dept].tasks += 1;
      if (log.status === 'Complete') deptMap[dept].completed += 1;
    });

    return Object.values(deptMap).map(d => ({
      ...d,
      completionRate: d.tasks > 0 ? Math.round((d.completed / d.tasks) * 100) : 0
    })).sort((a, b) => b.hours - a.hours);
  }, [filteredLogs]);

  // Status Distribution Data
  const statusData = useMemo(() => {
    const counts = { Complete: 0, 'In Progress': 0, Pending: 0 };
    filteredLogs.forEach(log => {
      if (counts[log.status] !== undefined) counts[log.status]++;
    });
    return [
      { name: 'Complete', value: counts.Complete, color: '#22c55e' },
      { name: 'In Progress', value: counts['In Progress'], color: '#eab308' },
      { name: 'Pending', value: counts.Pending, color: '#94a3b8' }
    ].filter(item => item.value > 0);
  }, [filteredLogs]);

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '', department: 'all' });
  };

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

  return (
    <>
      <Helmet>
        <title>Reports & Analytics - Future Designz</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-1">Comprehensive overview of organizational performance</p>
            </div>
            <div className="flex space-x-2">
              <ExportButton 
                data={deptData} 
                filename="Department_Performance_Report" 
                columns={[
                  { header: 'Department', key: 'name' },
                  { header: 'Total Hours', key: 'hours' },
                  { header: 'Total Tasks', key: 'tasks' },
                  { header: 'Completion Rate (%)', key: 'completionRate' }
                ]} 
              />
            </div>
          </div>

          <FilterBar 
            filters={filters} 
            onFilterChange={setFilters} 
            onClearFilters={handleClearFilters}
            departments={departments}
            showEmployeeSearch={false}
            showStatus={false}
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <h3 className="text-2xl font-bold">{summaryStats.totalHours.toFixed(1)}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold">{summaryStats.completionRate}%</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <h3 className="text-2xl font-bold">{summaryStats.totalTasks}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                  <h3 className="text-2xl font-bold">{summaryStats.activeEmployees}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Department Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Hours by Department</CardTitle>
                <CardDescription>Total hours logged across different departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  {deptData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{fill: 'hsl(var(--muted))'}}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="hours" name="Hours Logged" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">No data available for selected filters</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Pie Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Overall breakdown of task statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex flex-col items-center justify-center">
                  {statusData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {statusData.map((entry, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">No data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
