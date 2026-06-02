import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Target, 
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Overview: React.FC = () => {
  const { data, loading } = useDashboardData();

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { meta, key_findings } = data;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 text-left"
    >
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div variants={item} className="space-y-1">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Report</h4>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase leading-none">MortalTrace Dashboard</h1>
        </motion.div>
        
        <motion.div variants={item} className="flex items-center space-x-2 rounded-full bg-emerald-500/10 px-4 py-1.5 border border-emerald-500/20">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest text-left">Active Analysis Session</span>
        </motion.div>
      </div>

      {/* Hero Card - Fixed Theme Colors */}
      <motion.div variants={item}>
        <Card className="border-none bg-primary text-white shadow-2xl relative overflow-hidden group">
          <CardContent className="p-12 relative z-10 text-left">
            <div className="max-w-4xl space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                 <Sparkles className="h-3 w-3 text-white" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white">Advanced Framework v2.4</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-tight italic text-left text-white">
                "{meta.project_title}"
              </h2>
              <p className="text-lg text-white/80 font-medium leading-relaxed text-left max-w-3xl">
                {meta.subtitle}
              </p>
              <div className="flex items-center space-x-6 text-left">
                <button className="inline-flex items-center rounded-lg bg-white text-primary px-8 py-3 text-sm font-black transition-all hover:bg-slate-100 active:scale-95 shadow-lg shadow-black/10">
                  Begin Investigation <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <div className="flex items-center text-xs font-bold text-white/60 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Paper
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-20 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
               <ShieldCheck className="h-[450px] w-[450px]" />
            </div>
            {/* Ambient glows */}
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Metadata Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
        {[
          { label: 'Primary Target', value: meta.target_disease, icon: Target, accent: 'bg-rose-500' },
          { label: 'Dataset Epoch', value: meta.analysis_period, icon: Calendar, accent: 'bg-amber-500' },
          { label: 'Origin Source', value: meta.institution, icon: GraduationCap, accent: 'bg-blue-500' },
          { label: 'Lead Analysts', value: meta.authors.join(', '), icon: Users, accent: 'bg-indigo-500' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="h-full group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-left">
                <div className="mb-4 flex items-center justify-between">
                  <div className={cn("h-1 w-8 rounded-full", stat.accent)} />
                  <stat.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 text-left">{stat.label}</p>
                <p className="text-base font-bold text-foreground truncate text-left">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Key Findings */}
      <div className="space-y-8 text-left">
        <motion.div variants={item} className="flex items-center space-x-3 text-left">
          <div className="h-[1px] flex-1 bg-border" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Strategic Core Discoveries</h3>
          <div className="h-[1px] flex-1 bg-border" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
          {Object.entries(key_findings).map(([key, findings], idx) => (
            <motion.div key={key} variants={item}>
              <Card className="h-full flex flex-col hover:border-primary/20 transition-all text-left">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between text-left">
                    <CardTitle className="text-primary text-left">{key.replace('_', ' ')}</CardTitle>
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase">0{idx+1}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col py-6 text-left">
                  <ul className="space-y-4 flex-1 text-left">
                    {findings.map((finding, fidx) => (
                      <li key={fidx} className="group flex items-start text-xs font-semibold leading-relaxed text-muted-foreground text-left">
                        <span className="mr-3 mt-1 h-1 w-1 shrink-0 rounded-full bg-border transition-all group-hover:bg-primary group-hover:scale-150" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors text-left">
                     View Data <ExternalLink className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Footer */}
      <motion.div variants={item} className="flex items-center justify-between py-6 border-t border-border text-left">
        <div className="flex items-center space-x-3 text-left">
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-xs font-bold text-muted-foreground text-left">Source: <code className="text-foreground bg-muted px-2 py-0.5 rounded font-mono">{meta.generated_from}</code></span>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-left">© 2026 UNESA Data Mining Team</p>
      </motion.div>
    </motion.div>
  );
};
