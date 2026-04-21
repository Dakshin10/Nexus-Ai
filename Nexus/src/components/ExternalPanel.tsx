import { 
  Mail, 
  FileText, 
  StickyNote, 
  X,
  ChevronRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useEmails } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { GmailConnectButton } from './GmailConnectButton';
import { NotionConnectButton } from './NotionConnectButton';

const EmailCard = ({ email }: any) => (
  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">New Communication</span>
      <span className="text-[10px] text-slate-600 font-mono">{new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <h5 className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1">{email.title}</h5>
    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">{email.body_preview}</p>
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-400 font-medium">{email.author}</span>
      <button className="p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </button>
    </div>
  </div>
);

export const ExternalPanel: React.FC = () => {
  const { isExternalPanelOpen, toggleExternalPanel, isGmailConnected, isNotionConnected } = useNexusStore();
  const { data: emailData, isLoading } = useEmails(true);

  return (
    <AnimatePresence>
      {isExternalPanelOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-96 bg-black/40 backdrop-blur-3xl border-l border-white/5 z-30 flex flex-col"
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">External Data</h3>
            <button 
              onClick={toggleExternalPanel}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Connection Section */}
            {(!isGmailConnected || !isNotionConnected) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Integrations</h4>
                </div>
                <div className="space-y-3">
                  {!isGmailConnected && <GmailConnectButton />}
                  {!isNotionConnected && <NotionConnectButton />}
                </div>
                <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                  Link your workspace to allow NEXUS to ingest communications and proactively manage your tasks.
                </p>
              </section>
            )}

            {/* Gmail Section */}
            {isGmailConnected && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Mail className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Gmail</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                    {isLoading ? '...' : emailData?.emails?.length || 0}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-24 rounded-2xl bg-white/[0.02] animate-pulse" />
                    ))
                  ) : (
                    emailData?.emails?.map((email: any) => (
                      <EmailCard key={email.nexus_id} email={email} />
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Documents Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <FileText className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Documents</h4>
              </div>
              <div className="p-8 rounded-2xl border border-dashed border-white/5 text-center">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">No active documents</p>
              </div>
            </section>

            {/* Notes Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <StickyNote className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Recent Notes</h4>
              </div>
              <div className="p-8 rounded-2xl border border-dashed border-white/5 text-center">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">No synced notes</p>
              </div>
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
