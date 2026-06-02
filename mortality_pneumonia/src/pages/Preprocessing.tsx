import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useChartTheme } from '../hooks/useChartTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tabs } from '../components/ui/Tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Scissors, AlertCircle, ListChecks, Filter, Fingerprint } from 'lucide-react';

export const Preprocessing: React.FC = () => {
  const { data, loading } = useDashboardData();
  const chartTheme = useChartTheme();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { outlier_detection, discretization } = data;

  const outlierData = [...outlier_detection.results].sort((a, b) => b.pct - a.pct);

  const tabs = [
    {
      id: 'outliers',
      label: 'Anomaly Detection',
      content: (
        <div className="space-y-10">
          <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <CardTitle>Outlier Variance Matrix</CardTitle>
                     <CardDescription>Method: {outlier_detection.method}</CardDescription>
                  </div>
                  <AlertCircle className="h-5 w-5 text-rose-500 opacity-50" />
               </div>
            </CardHeader>
            <CardContent>
              <div className="h-[450px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outlierData} layout="vertical" margin={{ left: 40, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartTheme.grid} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="variable" type="category" width={150} fontSize={10} fontWeight={800} axisLine={false} tickLine={false} tick={{ fill: chartTheme.text }} />
                    <Tooltip 
                      cursor={{ fill: chartTheme.grid }}
                      contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800, color: chartTheme.text }}
                      formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Outlier Density']} 
                    />
                    <Bar dataKey="pct" radius={[0, 10, 10, 0]} barSize={20}>
                      {outlierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pct > 10 ? chartTheme.rose : chartTheme.primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <CardTitle>Extreme Case Catalog</CardTitle>
               <CardDescription>Verified records with high mortality deviation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50 text-left">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Province</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 text-center">Temporal</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4 text-rose-600">TBC</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">Pneumonia</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">DBD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outlier_detection.notable_extreme_outliers.map((outlier, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50 transition-colors group">
                        <TableCell className="font-bold text-foreground text-left">{outlier.provinsi}</TableCell>
                        <TableCell className="font-mono text-[10px] font-black text-muted-foreground text-center">{outlier.tahun}</TableCell>
                        <TableCell className="text-right text-rose-600 font-black font-mono">{outlier.mortalitas_tbc.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-muted-foreground">{outlier.mortalitas_pneumonia.toFixed(4)}</TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">{outlier.mortalitas_dbd.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'discretization',
      label: 'Transaction Engine',
      content: (
        <div className="space-y-10 text-left">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: 'Binning Vector', val: discretization.method, icon: Filter },
              { label: 'System Throughput', val: `${discretization.total_transactions} Units`, icon: ListChecks },
              { label: 'Lexical Entropy', val: `${discretization.unique_items} Items`, icon: Fingerprint }
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-4 text-left">
                      <div className="p-2 rounded-lg bg-muted border border-border">
                         <s.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Structural Metric</span>
                   </div>
                   <p className="text-2xl font-black tracking-tight text-foreground">{s.val}</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-wider">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <CardTitle>Quantile Mapping</CardTitle>
                     <CardDescription>Transformation thresholds for symbolic encoding</CardDescription>
                  </div>
                  <Scissors className="h-5 w-5 text-indigo-500 opacity-50" />
               </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50 text-left">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Dimension</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 text-center">Codex</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">L-M Pivot</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4">M-H Pivot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discretization.thresholds.map((t, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-bold text-foreground py-4 text-left">{t.variable}</TableCell>
                        <TableCell className="text-center py-4">
                           <span className="text-[9px] font-black uppercase tracking-widest bg-foreground text-background px-2 py-1 rounded shadow-sm">{t.short_name}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono font-black text-blue-500 py-4">{t.q33.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono font-black text-rose-500 py-4">{t.q67.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-8 p-6 rounded-2xl bg-indigo-500 text-white flex items-center justify-between shadow-xl shadow-indigo-500/20">
                <div className="space-y-1 text-left">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status Analysis</p>
                   <p className="text-sm font-black tracking-tight uppercase tracking-widest">Global Distribution: {discretization.category_distribution}</p>
                </div>
                <ListChecks className="h-8 w-8 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase leading-none">Preprocessing Pipeline</h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Signal Purification & Feature Transformation</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};
