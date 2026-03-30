
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { calculateDepartmentMetrics } from '@/lib/aggregationUtils';

export const useDepartmentMetrics = (managerId) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!managerId) return;
      
      try {
        setLoading(true);
        // Fetch all logs for the manager's team to calculate overall department metrics
        const records = await pb.collection('daily_logs').getFullList({
          filter: `manager_id="${managerId}"`,
          $autoCancel: false
        });

        const deptMetrics = calculateDepartmentMetrics(records);
        setMetrics(deptMetrics);

      } catch (err) {
        console.error('Error fetching department metrics:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [managerId]);

  return { metrics, loading, error };
};
