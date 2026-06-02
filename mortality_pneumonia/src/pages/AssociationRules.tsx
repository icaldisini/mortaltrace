import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useChartTheme } from '../hooks/useChartTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Zap, Star, ShieldAlert, GitBranch, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const AssociationRules: React.FC = () => {
  const { data, loading } = useDashboardData();
  const chartTheme = useChartTheme();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { fp_growth, policy_rules } = data;

  const itemsetsData = fp_growth.top_itemsets_by_support.map(item => ({
    name: item.itemset.join(' & '),
    support: item.support
  }));

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Association Discovery</h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">FP-Growth Logic & Policy Synthesis</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 text-left">
        {/* Performance Benchmark Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle>Algorithm Throughput</CardTitle>
                  <CardDescription>Comparative execution latency</CardDescription>
               </div>
               <Zap className="h-5 w-5 text-amber-500 opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-left">
               <div className="p-5 rounded-2xl bg-foreground text-background shadow-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2 text-left">FP-Growth (Active)</p>
                  <p className="text-3xl font-black tracking-tighter text-left">{fp_growth.performance_comparison.fp_growth.runtime_seconds}s</p>
               </div>
               <div className="p-5 rounded-2xl bg-muted border border-border">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-left">Legacy Apriori</p>
                  <p className="text-3xl font-black tracking-tighter text-muted-foreground text-left">{fp_growth.performance_comparison.apriori.runtime_seconds}s</p>
               </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/50 border border-border">
               <Terminal className="h-4 w-4 text-muted-foreground mt-0.5" />
               <p className="text-xs font-bold text-muted-foreground italic text-left">"{fp_growth.performance_comparison.note}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Global Statistics Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle>System Metadata</CardTitle>
                  <CardDescription>Aggregate metrics for {fp_growth.total_rules} patterns</CardDescription>
               </div>
               <Star className="h-5 w-5 text-primary opacity-50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg Confidence', val: `${(fp_growth.rules_statistics.confidence_mean * 100).toFixed(1)}%` },
                { label: 'Avg Lift Index', val: fp_growth.rules_statistics.lift_mean.toFixed(2) },
                { label: 'Support Floor', val: fp_growth.parameters.min_support.toFixed(2) },
                { label: 'Confidence Floor', val: fp_growth.parameters.min_confidence.toFixed(2) }
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-muted/50 border border-border transition-colors hover:border-primary/20 text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 text-left">{s.label}</p>
                  <p className="text-lg font-black tracking-tight text-foreground text-left">{s.val}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Synergistic Itemsets Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <CardTitle>Dominant Synergies</CardTitle>
                <CardDescription>Highest support combinations in provincial profiles</CardDescription>
             </div>
             <GitBranch className="h-5 w-5 text-muted-foreground opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemsetsData} layout="vertical" margin={{ left: 100, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartTheme.grid} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={180} fontSize={9} fontWeight={800} axisLine={false} tickLine={false} tick={{ fill: chartTheme.text }} />
                <Tooltip 
                  cursor={{ fill: chartTheme.grid }}
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800, color: chartTheme.text }}
                />
                <Bar dataKey="support" fill={chartTheme.primary} radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Interventions with Card items */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/20">
              <ShieldAlert className="h-5 w-5" />
           </div>
           <div className="space-y-0.5 text-left">
              <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Critical Interventions</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Policy-Grade Deterministic Rules</p>
           </div>
        </div>
        
        <div className="grid gap-6">
          {policy_rules.rules.map((rule, idx) => (
            <motion.div
              key={rule.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (idx * 0.05) }}
            >
              <Card className="hover:border-rose-500/30 transition-all border-l-4 border-l-rose-600 shadow-sm">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="p-8 flex flex-col items-center justify-center md:w-32 bg-muted/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Priority</span>
                    <span className="text-5xl font-black text-foreground tracking-tighter text-left">0{rule.rank}</span>
                  </div>
                  
                  <div className="flex-1 p-8 text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {rule.antecedents.map((ant, i) => (
                        <span key={i} className="px-3 py-1 bg-muted rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border text-left">{ant}</span>
                      ))}
                      <div className="px-2 font-black text-slate-300 text-left">→</div>
                      <span className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-rose-600/10 text-left">{rule.consequent}</span>
                    </div>
                    
                    <p className="text-lg font-bold text-foreground leading-snug mb-8 text-left">
                       "{rule.interpretation}"
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border/50 pt-6">
                      {[
                        { label: 'Confidence Index', val: `${(rule.confidence * 100).toFixed(1)}%`, accent: 'text-emerald-500' },
                        { label: 'Lift Intensity', val: rule.lift.toFixed(2), accent: 'text-indigo-500' },
                        { label: 'Support Frequency', val: rule.support.toFixed(3), accent: 'text-muted-foreground' },
                        { label: 'Conviction Depth', val: rule.conviction.toFixed(2), accent: 'text-amber-500' }
                      ].map(m => (
                        <div key={m.label} className="space-y-1 text-left">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground text-left">{m.label}</span>
                          <p className={cn("text-sm font-black font-mono tracking-tighter text-left", m.accent)}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
