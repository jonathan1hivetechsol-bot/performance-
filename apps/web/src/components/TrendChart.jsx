
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendChart = ({ data, type = 'area', dataKey1 = 'hours', dataKey2 = 'tasks', name1 = 'Hours', name2 = 'Tasks' }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm mb-1">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground mr-2">{entry.name}:</span>
              <span className="font-medium text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'area' ? (
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey={dataKey1} name={name1} stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#color1)" />
          <Area type="monotone" dataKey={dataKey2} name={name2} stroke="hsl(var(--secondary))" strokeWidth={2} fillOpacity={1} fill="url(#color2)" />
        </AreaChart>
      ) : (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey={dataKey1} name={name1} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey={dataKey2} name={name2} fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default TrendChart;
