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
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Brain, Award, ListChecks, Cpu, Search, Sparkles } from 'lucide-react';

export const Regression: React.FC = () => {
  const { data, loading } = useDashboardData();
  const chartTheme = useChartTheme();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { regression, shap_interpretability } = data;

  const modelData = regression.models.map(m => ({
    name: m.name,
    'CV R2': m.cv_r2,
    'Test R2': m.test_r2,
  }));

  const shapData = shap_interpretability.feature_importance
    .filter(f => f.mean_abs_shap !== null)
    .sort((a, b) => (b.mean_abs_shap || 0) - (a.mean_abs_shap || 0));

  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <div className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase leading-none">Predictive Intelligence</h1>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Ensemble Regression & Feature Attribution</p>
        </div>

        <div className="flex items-center space-x-4 rounded-xl bg-muted border border-border p-2.5">
          <Cpu className="h-4 w-4 text-primary" />
          <div className="text-[10px] font-black uppercase tracking-widest leading-none text-left">
            <p className="text-muted-foreground mb-0.5 text-left">Primary Target</p>
            <p className="text-foreground text-left">{regression.target.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Strategy Summary Card */}
      <Card>
        <CardContent className="py-8">
          <div className="grid gap-12 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { label: 'Validation Protocol', val: regression.validation_strategy },
              { label: 'Training Corpus', val: regression.split.train_years },
              { label: 'Test Horizon', val: regression.split.test_year },
              { label: 'Feature Space', val: `${regression.split.n_features} Dimensions` }
            ].map(s => (
              <div key={s.label} className="md:pl-10 first:pl-0 pt-6 md:pt-0 text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 text-left">{s.label}</p>
                <p className="text-sm font-bold text-foreground text-left">{s.val}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Layout */}
      <div className="grid gap-8 md:grid-cols-5 text-left">
        <Card className="md:col-span-3 text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle>Architecture Benchmarks</CardTitle>
               <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Metric: R-Squared</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full pt-4 text-left">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} dy={10} />
                  <YAxis domain={[0, 1]} axisLine={false} tickLine={false} fontSize={9} fontWeight={800} tick={{ fill: chartTheme.text }} />
                  <Tooltip 
                    cursor={{ fill: chartTheme.grid }}
                    contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 800, color: chartTheme.text }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingBottom: '20px' }} />
                  <Bar dataKey="CV R2" fill={chartTheme.isDark ? '#334155' : '#e2e8f0'} radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="Test R2" fill={chartTheme.primary} radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Champion Architecture Card - Fixed theme logic */}
        <Card className="md:col-span-2 border-2 border-primary shadow-2xl shadow-primary/10 relative overflow-hidden">
          <CardHeader className="border-border/30 text-left">
            <div className="flex items-center justify-between text-left">
               <CardTitle className="text-primary text-left flex items-center">
                 <Award className="mr-2 h-5 w-5" />
                 Champion Architecture
               </CardTitle>
               <Sparkles className="h-5 w-5 text-primary opacity-50" />
            </div>
            <CardDescription className="text-muted-foreground font-black uppercase tracking-widest text-left">{regression.best_model.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 pt-8 text-left">
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-left">Accuracy (Test)</p>
                <p className="text-3xl font-black tracking-tighter text-foreground text-left">{regression.best_model.test_r2.toFixed(4)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-left">Error Index (MAE)</p>
                <p className="text-3xl font-black tracking-tighter text-foreground text-left">{regression.best_model.test_mae.toFixed(4)}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-left">
               {[
                 { label: 'CV MEAN ACCURACY', val: regression.best_model.cv_r2.toFixed(4) },
                 { label: 'TERMINAL RMSE', val: regression.best_model.test_rmse.toFixed(4) }
               ].map(stat => (
                 <div key={stat.label} className="flex items-center justify-between border-b border-border/50 pb-3 text-left">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-left">{stat.label}</span>
                    <span className="font-mono text-sm font-black text-primary text-left">{stat.val}</span>
                 </div>
               ))}
            </div>

            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 text-left">
               <p className="text-xs font-bold leading-relaxed text-foreground italic">"{regression.best_model.note}"</p>
            </div>
            
            {/* Background decorative elements to maintain "Champion" feel without inverting colors */}
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          </CardContent>
        </Card>
      </div>

      {/* SHAP Card */}
      <Card className="bg-gradient-to-br from-muted/50 to-card">
        <CardHeader>
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <CardTitle>SHAP Feature Attribution</CardTitle>
                <CardDescription>Explaining model predictions via game-theoretic importance values</CardDescription>
             </div>
             <Brain className="h-6 w-6 text-indigo-500 opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-12 items-center text-left">
            <div className="md:col-span-3 h-[450px] text-left">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartTheme.grid} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" width={140} fontSize={9} fontWeight={800} axisLine={false} tickLine={false} tick={{ fill: chartTheme.text }} />
                  <Tooltip 
                    cursor={{ fill: chartTheme.grid }}
                    contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 800, color: chartTheme.text }}
                  />
                  <Bar dataKey="mean_abs_shap" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="md:col-span-2 space-y-10 text-left">
              <div className="space-y-4 text-left">
                 <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-left">
                    <Search className="h-3 w-3 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 text-left">Primary Discovery</span>
                 </div>
                 <p className="text-xl font-black text-foreground leading-tight text-left">
                    {shap_interpretability.key_finding}
                 </p>
              </div>
              
              <div className="space-y-4 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center text-left">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Predictor Ranking
                </h4>
                <div className="space-y-1 text-left">
                  {shapData.slice(0, 5).map((f, idx) => (
                    <div key={f.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                      <div className="flex items-center space-x-4 text-left">
                        <span className="text-[10px] font-black text-muted-foreground opacity-50">0{idx+1}</span>
                        <span className="text-xs font-bold text-foreground">{f.label}</span>
                      </div>
                      <span className="font-mono text-[10px] font-black text-indigo-500">{(f.mean_abs_shap || 0).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
