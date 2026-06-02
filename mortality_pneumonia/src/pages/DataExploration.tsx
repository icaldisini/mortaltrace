import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useChartTheme } from '../hooks/useChartTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { Database, AlertTriangle, TrendingUp, Table as TableIcon, Zap, Filter } from 'lucide-react';

export const DataExploration: React.FC = () => {
  const { data, loading } = useDashboardData();
  const chartTheme = useChartTheme();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { dataset, descriptive_statistics, temporal_trends } = data;

  const trendData = Object.entries(temporal_trends.changes_2018_to_2023).map(([_, value]) => ({
    name: value.label,
    change: value.change_pct,
    '2018': value.value_2018,
    '2023': value.value_2023,
  }));

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Data Inventory</h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Structural Analysis & Statistical Foundations</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Pipeline Architecture Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle>System Pipeline</CardTitle>
                  <CardDescription>Transformation from Raw Ingestion to Refined Dataset</CardDescription>
               </div>
               <Database className="h-5 w-5 text-primary opacity-50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-8 rounded-2xl bg-muted/20 border border-border/50">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Inbound Stream</p>
                  <p className="text-4xl font-black tracking-tighter text-foreground">{dataset.raw.rows}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Total Entries</p>
               </div>

               <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-px w-full bg-border" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-card p-2 rounded-full border border-border shadow-sm">
                        <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
                     </div>
                  </div>
               </div>

               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-3">Verified Corpus</p>
                  <p className="text-4xl font-black tracking-tighter text-primary">{dataset.cleaned.rows}</p>
                  <p className="text-[10px] font-bold text-primary/70 uppercase mt-1">Cleaned Records</p>
               </div>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                 { label: 'Geographic Scope', val: `${dataset.cleaned.unique_provinces} Provinces`, icon: Filter },
                 { label: 'Temporal Span', val: `${dataset.cleaned.years.length} Years`, icon: TrendingUp },
                 { label: 'Feature Vectors', val: dataset.cleaned.columns, icon: Database },
                 { label: 'Data Fidelity', val: '100%', icon: Zap }
               ].map(m => (
                 <div key={m.label} className="space-y-2">
                    <div className="flex items-center space-x-2">
                       <m.icon className="h-3 w-3 text-muted-foreground" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{m.val}</p>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Values Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle>Nullity Report</CardTitle>
                  <CardDescription>Preprocessing detection</CardDescription>
               </div>
               <AlertTriangle className="h-5 w-5 text-amber-500 opacity-50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(dataset.missing_values_raw).map(([key, val]) => ({ name: key, pct: val.pct }))}
                  layout="vertical"
                  margin={{ left: -20, right: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} fontSize={9} fontWeight={800} axisLine={false} tickLine={false} tick={{ fill: chartTheme.text }} />
                  <Tooltip 
                    cursor={{ fill: chartTheme.grid }} 
                    contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800, color: chartTheme.text }}
                  />
                  <Bar dataKey="pct" fill={chartTheme.amber} radius={[0, 4, 4, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Terminal Status: <span className="text-emerald-500">{dataset.missing_values_after_cleaning}</span>
               </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temporal Trends Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <CardTitle>Chronological Variance</CardTitle>
                <CardDescription>Delta shift analysis (2018-2023) across mortality indicators</CardDescription>
             </div>
             <TrendingUp className="h-5 w-5 text-emerald-500 opacity-50" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartTheme.emerald} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={chartTheme.emerald} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} dy={10} tick={{ fill: chartTheme.text }} />
                <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tickFormatter={(v) => `${v}%`} tick={{ fill: chartTheme.text }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 800, color: chartTheme.text }}
                />
                <Area type="monotone" dataKey="change" stroke={chartTheme.emerald} strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" name="Percentage Change" />
                <ReferenceLine y={0} stroke={chartTheme.text} strokeWidth={1} strokeOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-8 border-t border-border bg-muted/10">
             <div className="flex items-start gap-4 text-left">
                <div className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded">INSIGHT</div>
                <p className="text-sm font-bold text-muted-foreground italic">"{temporal_trends.note}. {temporal_trends.covid_annotation.note} ({temporal_trends.covid_annotation.year})"</p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptive Statistics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <CardTitle>Feature Metadata</CardTitle>
                <CardDescription>Quantile distribution and central tendency metrics</CardDescription>
             </div>
             <TableIcon className="h-5 w-5 text-muted-foreground opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
             <Table>
               <TableHeader className="bg-muted/50 text-left">
                 <TableRow className="hover:bg-transparent">
                   <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Dimension</TableHead>
                   <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4 text-left">Mean</TableHead>
                   <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4 text-left">Dev.</TableHead>
                   <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4 text-left">Max</TableHead>
                   <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-4 text-left">Median</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {Object.entries(descriptive_statistics).map(([key, stats]) => (
                   <TableRow key={key} className="hover:bg-muted/50 transition-colors">
                     <TableCell className="font-bold text-foreground py-4 text-left">{stats.label}</TableCell>
                     <TableCell className="text-right font-mono font-black text-primary py-4">{stats.mean.toLocaleString()}</TableCell>
                     <TableCell className="text-right font-mono text-muted-foreground py-4">{stats.std.toLocaleString()}</TableCell>
                     <TableCell className="text-right font-mono font-bold text-foreground py-4">{stats.max.toLocaleString()}</TableCell>
                     <TableCell className="text-right font-mono text-muted-foreground py-4">{stats.median.toLocaleString()}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
