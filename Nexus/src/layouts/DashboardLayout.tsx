import { SyncAllButton } from '../components/SyncAllButton';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExternalPanelOpen, isGraphVisible } = useNexusStore();

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans antialiased">
      {/* Sidebar - Icons Only */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tighter text-white">NEXUS</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <SyncAllButton />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">System Active</span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Operator 01</p>
                <p className="text-[10px] text-slate-500 uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className={cn(
            "max-w-6xl mx-auto transition-all duration-500 ease-in-out",
            isExternalPanelOpen ? "mr-96" : "mr-0"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
