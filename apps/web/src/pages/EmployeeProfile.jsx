
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';
import Header from '@/components/Header.jsx';
import FilterBar from '@/components/FilterBar.jsx';
import EmployeeLogsView from '@/components/EmployeeLogsView.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Building, UserCircle, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const targetId = id || currentUser?.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [manager, setManager] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [stats, setStats] = useState({ totalHours: 0, completionRate: 0, totalTasks: 0 });
  const [chartData, setChartData] = useState([]);
  
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employee details
        const empRecord = await pb.collection('users').getOne(targetId, { $autoCancel: false });
        setEmployee(empRecord);

        // Fetch manager details if exists
        if (empRecord.manager_id) {
          try {
            const mgrRecord = await pb.collection('users').getOne(empRecord.manager_id, { $autoCancel: false });
            setManager(mgrRecord);
          } catch (err) {
            console.warn("Manager not found or inaccessible:", handlePocketBaseError(err));
            setManager({ name: 'Manager data unavailable' });
          }
        }

        // Fetch all logs for this employee
        const logsRecords = await pb.collection('daily_logs').getFullList({
          filter: `employee_id="${targetId}"`,
          sort: '-date_submitted',
          $autoCancel: false
        });
        
        setLogs(logsRecords);
        applyFilters(logsRecords, filters);
        calculateStats(logsRecords);
        generateChartData(logsRecords);

      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(handlePocketBaseError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetId]);

  useEffect(() => {
    applyFilters(logs, filters);
  }, [filters, logs]);

  const applyFilters = (allLogs, currentFilters) => {
    let result = [...allLogs];

    if (currentFilters.status && currentFilters.status !== 'all') {
      result = result.filter(log => log.status === currentFilters.status);
    }
    if (currentFilters.startDate) {
      result = result.filter(log => log.date_submitted >= currentFilters.startDate);
    }
    if (currentFilters.endDate) {
      result = result.filter(log => log.date_submitted <= currentFilters.endDate);
    }

    setFilteredLogs(result);
  };

  const calculateStats = (logData) => {
    const totalTasks = logData.length;
    const totalHours = logData.reduce((sum, log) => sum + log.hours_spent, 0);
    const completedTasks = logData.filter(log => log.status === 'Complete').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setStats({ totalTasks, totalHours, completionRate });
  };

  const generateChartData = (logData) => {
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayLogs = logData.filter(log => log.date_submitted === date);
      const hours = dayLogs.reduce((sum, log) => sum + log.hours_spent, 0);
      
      data.push({
        date: format(parseISO(date), 'MMM dd'),
        hours: hours
      });
    }
    setChartData(data);
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', startDate: '', endDate: '' });
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

  if (error || !employee) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-muted/30 p-8">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Card className="border-destructive/50 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Profile Unavailable</h2>
                <p className="text-muted-foreground">{error || "Employee data could not be loaded."}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const initials = employee.name ? employee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';

  return (
    <>
      <Helmet>
        <title>{`${employee.name} - Profile`}</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Profile Info Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-sm">
                    <AvatarImage src={employee.avatar ? pb.files.getUrl(employee, employee.avatar) : ''} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
                  <p className="text-muted-foreground">{employee.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-foreground">{employee.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-foreground">{employee.department || 'Unassigned Department'}</span>
                  </div>
                  {manager && (
                    <div className="flex items-center text-sm">
                      <UserCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground">Manager: {manager.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats & Chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                      <h3 className="text-2xl font-bold">{stats.totalHours.toFixed(1)}</h3>
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
                      <h3 className="text-2xl font-bold">{stats.completionRate}%</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <h3 className="text-2xl font-bold">{stats.totalTasks}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hours Logged (Last 14 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Work History</h3>
            <FilterBar 
              filters={filters} 
              onFilterChange={setFilters} 
              onClearFilters={handleClearFilters}
              showDepartment={false}
              showEmployeeSearch={false}
            />
          </div>

          <EmployeeLogsView logs={filteredLogs} />
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;
