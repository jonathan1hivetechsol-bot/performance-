
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmployeeLogsView = ({ logs }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs;

    if (statusFilter !== 'all') {
      filtered = logs.filter(log => log.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date_submitted);
      const dateB = new Date(b.date_submitted);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [logs, statusFilter, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No daily logs submitted yet</p>
            <p className="text-sm text-muted-foreground mt-2">Submit your first log using the form above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your daily logs</CardTitle>
            <CardDescription>View and filter your submitted work logs</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={toggleSort}
                    className="flex items-center space-x-1 hover:bg-transparent p-0 h-auto font-semibold"
                  >
                    <span>Date submitted</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead>Task name</TableHead>
                <TableHead>Hours spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Work detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(new Date(log.date_submitted), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{log.task_name}</TableCell>
                  <TableCell>{log.hours_spent}h</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.department}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.work_detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeLogsView;
