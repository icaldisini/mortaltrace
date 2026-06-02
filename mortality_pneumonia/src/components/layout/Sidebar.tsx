import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Activity, 
  GitBranch, 
  Layers, 
  TrendingUp, 
  Map as MapIcon,
  ChevronRight,
  Shield,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { useSidebar } from '../SidebarProvider';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/data-exploration', icon: Database, label: 'Data Inventory' },
  { to: '/preprocessing', icon: Activity, label: 'Preprocessing' },
  { to: '/association-rules', icon: GitBranch, label: 'Association Rules' },
  { to: '/clustering', icon: Layers, label: 'Clustering' },
  { to: '/regression', icon: TrendingUp, label: 'Predictive Models' },
  { to: '/interactive-maps', icon: MapIcon, label: 'Geospatial Maps' },
];

export const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex h-full flex-col px-4 py-8">
        <div className={cn("mb-12 flex items-center transition-all duration-300", isOpen ? "px-4" : "px-0 justify-center")}>
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20 shrink-0",
            !isOpen && "mr-0"
          )}>
            <Shield className="h-5 w-5 text-white" />
          </div>
          {isOpen && (
            <span className="ml-3 text-lg font-black tracking-tighter text-foreground uppercase italic whitespace-nowrap overflow-hidden">
              MortalTrace
            </span>
          )}
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-lg py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                  isOpen ? "px-4 justify-between" : "px-0 justify-center",
                  isActive 
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )
              }
            >
              <div className="flex items-center">
                <item.icon className={cn("h-4 w-4 shrink-0", isOpen && "mr-3")} />
                {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </div>
              {isOpen && (
                <ChevronRight className={cn("h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5")} />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-6 px-2 text-left">
          <div className={cn(
            "flex items-center rounded-xl bg-muted/50 p-2 border border-border transition-all duration-300",
            isOpen ? "justify-between px-4 py-4" : "justify-center px-0 py-2 flex-col space-y-4"
          )}>
             {isOpen ? (
               <div className="space-y-0.5">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Appearance</p>
                 <p className="text-[10px] font-bold text-foreground uppercase">UI Theme</p>
               </div>
             ) : null}
             <ThemeToggle />
             <button 
               onClick={toggle}
               className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
               title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
             >
               {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
             </button>
          </div>
          
          {isOpen && (
            <div className="px-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              System v1.0.4
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
