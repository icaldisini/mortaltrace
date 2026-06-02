import { useState, useEffect } from 'react';
import type { DashboardData } from '../types/dashboard';
import dashboardDataRaw from '../data/dashboard_data.json';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this might be a fetch call. 
    // Here we use the imported JSON directly.
    setData(dashboardDataRaw as unknown as DashboardData);
    setLoading(false);
  }, []);

  return { data, loading };
};
