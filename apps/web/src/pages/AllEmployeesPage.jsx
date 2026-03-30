
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';
import Header from '@/components/Header.jsx';
import FilterBar from '@/components/FilterBar.jsx';
import ExportButton from '@/components/ExportButton.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const AllEmployeesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    department: 'all'
  });
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDirectoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all users
        const usersRecords = await pb.collection('users').getFullList({
          sort: 'name',
          $autoCancel: false
        });

        // Fetch all logs to calculate stats
        const logsRecords = await pb.collection('daily_logs').getFullList({
          $autoCancel: false
        });

        // Extract unique departments
        const depts = [...new Set(usersRecords.map(u => u.department).filter(Boolean))];
        setDepartments(depts);

        // Aggregate data
        const aggregatedData = usersRecords.map(user => {
          const userLogs = logsRecords.filter(log => log.employee_id === user.id);
          const totalTasks = userLogs.length;
          const totalHours = userLogs.reduce((sum, log) => sum + log.hours_spent, 0);
          const completedTasks = userLogs.filter(log => log.status === 'Complete').length;
          const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return {
            ...user,
            totalTasks,
            totalHours,
            completionRate
          };
        });

        setEmployees(aggregatedData);
      } catch (err) {
        console.error('Failed to fetch directory:', err);
        setError(handlePocketBaseError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(emp => 
        (emp.name && emp.name.toLowerCase().includes(searchLower)) || 
        (emp.email && emp.email.toLowerCase().includes(searchLower))
      );
    }
    if (filters.department && filters.department !== 'all') {
      result = result.filter(emp => emp.department === filters.department);
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      
      if (valA < valB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [employees, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setFilters({ search: '', department: 'all' });
    setCurrentPage(1);
  };

  const exportColumns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Department', key: 'department' },
    { header: 'Role', key: 'role' },
    { header: 'Total Tasks', key: 'totalTasks' },
    { header: 'Total Hours', key: 'totalHours' },
    { header: 'Completion Rate (%)', key: 'completionRate' }
  ];

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
        <div className="min-h-screen bg-muted/30 p-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-destructive/50 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load directory</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-6">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Employee Directory - Future Designz</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Directory</h1>
              <p className="text-muted-foreground mt-1">View and manage all team members</p>
            </div>
            <ExportButton 
              data={filteredAndSortedEmployees} 
              filename="Employee_Directory" 
              columns={exportColumns} 
            />
          </div>

          <FilterBar 
            filters={filters} 
            onFilterChange={(newFilters) => { setFilters(newFilters); setCurrentPage(1); }} 
            onClearFilters={handleClearFilters}
            departments={departments}
            showEmployeeSearch={true}
            showDateRange={false}
            showStatus={false}
          />

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('name')} className="font-semibold px-0 hover:bg-transparent">
                          Employee <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => handleSort('totalTasks')} className="font-semibold px-0 hover:bg-transparent justify-end w-full">
                          Tasks <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => handleSort('totalHours')} className="font-semibold px-0 hover:bg-transparent justify-end w-full">
                          Hours <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => handleSort('completionRate')} className="font-semibold px-0 hover:bg-transparent justify-end w-full">
                          Completion <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No employees found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedEmployees.map((emp) => (
                        <TableRow 
                          key={emp.id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigate(`/employee/${emp.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={emp.avatar ? pb.files.getUrl(emp, emp.avatar) : ''} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {emp.name ? emp.name.substring(0, 2).toUpperCase() : '??'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{emp.name || 'Unknown User'}</p>
                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{emp.department || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={emp.role === 'Manager' ? 'default' : 'secondary'}>
                              {emp.role || 'Employee'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{emp.totalTasks}</TableCell>
                          <TableCell className="text-right font-medium">{emp.totalHours.toFixed(1)}h</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className="font-medium">{emp.completionRate}%</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${emp.completionRate > 75 ? 'bg-green-500' : emp.completionRate > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${emp.completionRate}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)}</span> of <span className="font-medium">{filteredAndSortedEmployees.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AllEmployeesPage;
