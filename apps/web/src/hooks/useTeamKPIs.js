
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { calculateTeamKPIs } from '@/lib/aggregationUtils';

export const useTeamKPIs = (managerId) => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      if (!managerId) return;
      
      try {
        setLoading(true);
        // Fetch recent logs for KPI calculation (last 7 days is enough for today vs yesterday)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateStr = sevenDaysAgo.toISOString().split('T')[0];

        const records = await pb.collection('daily_logs').getFullList({
          filter: `manager_id="${managerId}" && date_submitted >= "${dateStr}"`,
          $autoCancel: false
        });

        const calculatedKPIs = calculateTeamKPIs(records);
        setKpis(calculatedKPIs);

      } catch (err) {
        console.error('Error fetching team KPIs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [managerId]);

  return { kpis, loading, error };
};
