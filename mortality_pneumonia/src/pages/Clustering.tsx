import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useChartTheme } from '../hooks/useChartTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tabs } from '../components/ui/Tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Layers, Info, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const Clustering: React.FC = () => {
  const { data, loading } = useDashboardData();
  const chartTheme = useChartTheme();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { clustering } = data;

  const islandData = Object.entries(clustering.kmeans.island_distribution).map(([cluster, distribution]) => ({
    name: cluster,
    ...distribution
  }));

  const islands = Object.keys(clustering.kmeans.island_distribution['Cluster 1']).filter(k => k !== 'Total');

  const tabs = [
    {
      id: 'kmeans',
      label: 'Cluster Profiles',
      content: (
        <div className="space-y-10 text-left">
          <div className="grid gap-8 md:grid-cols-2 text-left">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Vector</CardTitle>
                <CardDescription>Convergence analysis for K-Selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full pt-4 text-left">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clustering.kmeans.elbow_data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                      <XAxis dataKey="k" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 800, color: chartTheme.text }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingBottom: '20px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="inertia" stroke={chartTheme.primary} strokeWidth={3} dot={{ r: 3, fill: chartTheme.primary }} name="Inertia Index" />
                      <Line yAxisId="right" type="monotone" dataKey="silhouette" stroke={chartTheme.emerald} strokeWidth={3} dot={{ r: 3, fill: chartTheme.emerald }} name="Silhouette Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Mapping</CardTitle>
                <CardDescription>Regional composition per identified cluster</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full pt-4 text-left">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={islandData} margin={{ bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                      <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800, color: chartTheme.text }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingBottom: '20px' }} />
                      {islands.map((island, idx) => (
                        <Bar 
                          key={island} 
                          dataKey={island} 
                          stackId="a" 
                          fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'][idx % 7]} 
                          radius={idx === islands.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                          barSize={32}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            {Object.entries(clustering.kmeans.cluster_profiles).map(([id, profile], idx) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
              >
                <Card className="h-full border-l-4 border-l-primary group">
                  <CardHeader className="bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 text-left">
                         <CardTitle className="text-xl">{profile.label}</CardTitle>
                         <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{id}</p>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/10">
                        {profile.n_provinces}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-8 text-left">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {[
                        { label: 'Poverty Rate', val: `${profile.kemiskinan_pct.toFixed(2)}%`, accent: 'text-blue-500' },
                        { label: 'Mortality Index', val: profile.mortalitas_pneumonia.toFixed(3), accent: 'text-rose-500' },
                        { label: 'Healthcare Ratio', val: profile.rasio_dokter_per_100k.toFixed(1), accent: 'text-emerald-500' },
                        { label: 'Sanitation %', val: `${profile.akses_air_bersih_pct.toFixed(2)}%`, accent: 'text-indigo-500' }
                      ].map(m => (
                        <div key={m.label} className="space-y-1 text-left">
                          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground">{m.label}</p>
                          <p className={cn("text-base font-black tracking-tight", m.accent)}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center">
                        <MapPin className="mr-1.5 h-3 w-3" />
                        Cluster Membership
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-left">
                        {profile.provinces.map(p => (
                          <span key={p} className="rounded px-2 py-1 text-[9px] font-bold bg-muted border border-border text-muted-foreground">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'comparison',
      label: 'Benchmark',
      content: (
        <div className="space-y-8 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Performance Index</CardTitle>
              <CardDescription>Evaluation of high-dimensional separation quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-hidden text-left">
                <Table>
                  <TableHeader className="bg-muted/50 text-left">
                    <TableRow className="hover:bg-transparent text-left">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Algorithm</TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase tracking-widest py-4">K-Val</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">Silhouette</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">DB-Index</TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase tracking-widest py-4 text-left">Selection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clustering.comparison.map((c, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50 transition-colors text-left">
                        <TableCell className="font-black text-foreground">{c.algoritma}</TableCell>
                        <TableCell className="text-center font-mono font-bold text-muted-foreground">{c.n_clusters}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-emerald-500">{c.silhouette.toFixed(4)}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-indigo-500">{c.davies_bouldin.toFixed(4)}</TableCell>
                        <TableCell className="text-center">
                          {c.winner ? (
                            <span className="inline-flex items-center rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/20">
                              Primary
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                              Secondary
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-blue-600 text-white shadow-xl shadow-blue-600/20 text-left">
             <CardContent className="p-8 flex items-start gap-6 text-left">
                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                   <Info className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2 text-left">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Selection Logic</h4>
                   <p className="text-base font-bold leading-relaxed text-left">
                     K-Means was selected due to significantly higher separation quality (Silhouette 0.24) and better cohesion (DB Index 1.05). 
                     The model successfully segmented provinces into 4 distinct risk archetypes, providing a stable foundation for predictive regression.
                   </p>
                </div>
             </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left text-left">
        <div className="space-y-2 text-left text-left">
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase leading-none">Clustering Matrix</h1>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Multi-Dimensional Risk Segmentation</p>
        </div>

        <div className="flex items-center space-x-6 text-left">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Vector Basis</p>
              <p className="text-sm font-bold text-foreground">{clustering.features_used.length} Features</p>
           </div>
           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted border border-border">
              <Layers className="h-5 w-5 text-primary" />
           </div>
        </div>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};
