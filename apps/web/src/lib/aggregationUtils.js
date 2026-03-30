
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, isSameWeek, isSameMonth, subDays } from 'date-fns';

export const aggregateDailyData = (logs, startDate, endDate) => {
  const start = startDate ? new Date(startDate) : subDays(new Date(), 14);
  const end = endDate ? new Date(endDate) : new Date();
  
  const days = eachDayOfInterval({ start, end });
  
  return days.map(day => {
    const dayLogs = logs.filter(log => isSameDay(parseISO(log.date_submitted), day));
    const hours = dayLogs.reduce((sum, log) => sum + log.hours_spent, 0);
    const tasks = dayLogs.length;
    const completed = dayLogs.filter(l => l.status === 'Complete').length;
    
    return {
      date: format(day, 'MMM dd'),
      fullDate: format(day, 'yyyy-MM-dd'),
      hours,
      tasks,
      completed,
      completionRate: tasks > 0 ? Math.round((completed / tasks) * 100) : 0
    };
  });
};

export const aggregateWeeklyData = (logs, startDate, endDate) => {
  const start = startDate ? new Date(startDate) : subDays(new Date(), 90);
  const end = endDate ? new Date(endDate) : new Date();
  
  const weeks = eachWeekOfInterval({ start, end });
  
  return weeks.map(weekStart => {
    const weekLogs = logs.filter(log => isSameWeek(parseISO(log.date_submitted), weekStart));
    const hours = weekLogs.reduce((sum, log) => sum + log.hours_spent, 0);
    const tasks = weekLogs.length;
    const completed = weekLogs.filter(l => l.status === 'Complete').length;
    
    return {
      date: `Week of ${format(weekStart, 'MMM dd')}`,
      hours,
      tasks,
      completed,
      completionRate: tasks > 0 ? Math.round((completed / tasks) * 100) : 0
    };
  });
};

export const aggregateMonthlyData = (logs, startDate, endDate) => {
  const start = startDate ? new Date(startDate) : subDays(new Date(), 365);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = eachMonthOfInterval({ start, end });
  
  return months.map(monthStart => {
    const monthLogs = logs.filter(log => isSameMonth(parseISO(log.date_submitted), monthStart));
    const hours = monthLogs.reduce((sum, log) => sum + log.hours_spent, 0);
    const tasks = monthLogs.length;
    const completed = monthLogs.filter(l => l.status === 'Complete').length;
    
    return {
      date: format(monthStart, 'MMM yyyy'),
      hours,
      tasks,
      completed,
      completionRate: tasks > 0 ? Math.round((completed / tasks) * 100) : 0
    };
  });
};

export const calculateTeamKPIs = (logs, targetDate = new Date()) => {
  const todayLogs = logs.filter(log => isSameDay(parseISO(log.date_submitted), targetDate));
  const yesterdayLogs = logs.filter(log => isSameDay(parseISO(log.date_submitted), subDays(targetDate, 1)));
  
  const calcMetrics = (data) => {
    const tasks = data.length;
    const hours = data.reduce((sum, log) => sum + log.hours_spent, 0);
    const completed = data.filter(l => l.status === 'Complete').length;
    const uniqueEmployees = new Set(data.map(l => l.employee_id)).size;
    
    return {
      tasks,
      hours,
      completionRate: tasks > 0 ? Math.round((completed / tasks) * 100) : 0,
      avgHoursPerEmployee: uniqueEmployees > 0 ? +(hours / uniqueEmployees).toFixed(1) : 0
    };
  };

  const today = calcMetrics(todayLogs);
  const yesterday = calcMetrics(yesterdayLogs);

  const getTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    today,
    trends: {
      tasks: getTrend(today.tasks, yesterday.tasks),
      hours: getTrend(today.hours, yesterday.hours),
      completionRate: today.completionRate - yesterday.completionRate,
      avgHours: getTrend(today.avgHoursPerEmployee, yesterday.avgHoursPerEmployee)
    }
  };
};

export const calculateDepartmentMetrics = (logs) => {
  const deptMap = {};
  
  logs.forEach(log => {
    const dept = log.department || 'Unassigned';
    if (!deptMap[dept]) {
      deptMap[dept] = { name: dept, hours: 0, tasks: 0, completed: 0, employees: new Set() };
    }
    deptMap[dept].hours += log.hours_spent;
    deptMap[dept].tasks += 1;
    if (log.status === 'Complete') deptMap[dept].completed += 1;
    deptMap[dept].employees.add(log.employee_id);
  });

  return Object.values(deptMap).map(d => ({
    name: d.name,
    hours: d.hours,
    tasks: d.tasks,
    employeeCount: d.employees.size,
    avgHours: d.employees.size > 0 ? +(d.hours / d.employees.size).toFixed(1) : 0,
    completionRate: d.tasks > 0 ? Math.round((d.completed / d.tasks) * 100) : 0
  })).sort((a, b) => b.completionRate - a.completionRate);
};
