
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { aggregateDailyData, aggregateWeeklyData, aggregateMonthlyData } from '@/lib/aggregationUtils';

export const usePerformanceData = (userId, view = 'daily') => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ tasks: 0, hours: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const records = await pb.collection('daily_logs').getFullList({
          filter: `employee_id="${userId}"`,
          sort: '-date_submitted',
          $autoCancel: false
        });

        let aggregated = [];
        if (view === 'daily') {
          aggregated = aggregateDailyData(records);
        } else if (view === 'weekly') {
          aggregated = aggregateWeeklyData(records);
        } else if (view === 'monthly') {
          aggregated = aggregateMonthlyData(records);
        }

        setData(aggregated);

        // Calculate overall summary for the fetched records
        const totalTasks = records.length;
        const totalHours = records.reduce((sum, log) => sum + log.hours_spent, 0);
        const completed = records.filter(l => l.status === 'Complete').length;
        
        setSummary({
          tasks: totalTasks,
          hours: totalHours,
          completionRate: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0
        });

      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, view]);

  return { data, summary, loading, error };
};
