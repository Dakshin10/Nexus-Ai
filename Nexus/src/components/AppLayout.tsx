import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Globe,
  Target,
  Telescope,
  Bot,
  Network,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

// ─── Nav Config ─────────────────────────────────────────────────────────────

const coreEngines: NavItem[] = [
  { to: "/",          icon: Sparkles,       label: "Stream Engine"     },
  { to: "/external",  icon: Globe,          label: "External Hub"      },
  { to: "/decision",  icon: Target,         label: "Decision Engine"   },
  { to: "/agent",     icon: Bot,            label: "Agent Engine"      },
  { to: "/prediction",icon: Telescope,      label: "Prediction Engine" },
  { to: "/graph",     icon: Network,        label: "Graph View"        },
];

const management: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Insights"  },
  { to: "/settings",  icon: Settings,        label: "Settings"  },
];

// ─── SidebarItem ─────────────────────────────────────────────────────────────

const SidebarItem = ({ to, icon: Icon, label, active, collapsed }: NavItem & { active: boolean; collapsed: boolean }) => (
  <Link
    to={to}
    title={collapsed ? label : undefined}
    className={cn(
      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
      active
        ? "bg-primary text-white glow-primary"
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className={cn(
      "shrink-0 w-5 h-5 transition-transform duration-300 group-hover:scale-110",
      active ? "text-white" : "text-muted-foreground"
    )} />

    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.span
          key="label"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {/* Active indicator glow strip */}
    {active && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute inset-y-0 right-0 w-1 bg-white/40 rounded-l-full"
      />
    )}
  </Link>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col py-6 bg-background/60 backdrop-blur-2xl border-r border-white/5 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 mb-10 px-4 min-w-0")}>
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.h1
              key="logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-2xl font-black tracking-tighter whitespace-nowrap"
            >
              NEXUS
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        <div className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-3 transition-all duration-300",
          collapsed ? "text-center px-0" : "px-3"
        )}>
          {collapsed ? "•••" : "Core Engines"}
        </div>

        {coreEngines.map((item) => (
          <SidebarItem
            key={item.to}
            {...item}
            active={location.pathname === item.to}
            collapsed={collapsed}
          />
        ))}

        <div className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-6 mb-3 transition-all duration-300",
          collapsed ? "text-center px-0" : "px-3"
        )}>
          {collapsed ? "•••" : "Management"}
        </div>

        {management.map((item) => (
          <SidebarItem
            key={item.to}
            {...item}
            active={location.pathname === item.to}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* User profile */}
      <div className="mt-auto px-3 pt-4 border-t border-white/5">
        <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer", collapsed && "justify-center")}>
          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-0.5">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="profile-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-bold truncate">Senior Engineer</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium Tier</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.button
                key="logout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
};

// ─── AppLayout ───────────────────────────────────────────────────────────────

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 256;

  return (
    <div className="flex bg-background text-foreground min-h-screen selection:bg-primary/30">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />

      <motion.main
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="flex-1 relative overflow-x-hidden min-h-screen"
      >
        {/* Ambient background gradients */}
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[130px] animate-pulse [animation-delay:2s]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={children?.toString()}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};
