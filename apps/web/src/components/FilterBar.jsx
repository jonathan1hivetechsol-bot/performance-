
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Calendar as CalendarIcon } from 'lucide-react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  departments = [], 
  showEmployeeSearch = false,
  showDateRange = true,
  showStatus = true,
  showDepartment = true
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-end lg:items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        
        {showEmployeeSearch && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Search Employee</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={filters.search || ''}
                onChange={(e) => handleChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {showDepartment && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Department</label>
            <Select 
              value={filters.department || 'all'} 
              onValueChange={(val) => handleChange('department', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showStatus && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(val) => handleChange('status', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showDateRange && (
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">Date Range</label>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <Button 
        variant="ghost" 
        onClick={onClearFilters}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
};

export default FilterBar;
