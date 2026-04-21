import React, { useState } from "react";
import { GmailCard } from "./GmailCard";
import { UploadBox } from "./UploadBox";
import { ActionPanel } from "./ActionPanel";
import { motion } from "framer-motion";
import { 
  Globe, 
  Mail, 
  FileText, 
  Plus, 
  Link as LinkIcon, 
  RefreshCcw 
} from "lucide-react";
import { Button } from "./ui/button";

export const ExternalPage: React.FC = () => {
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);

  const mockEmails = [
    { id: "1", subject: "Critical: Backend Architecture Feedback", sender: "alex@nexus.ai", priority: "high" as const, timestamp: "2m ago" },
    { id: "2", subject: "Weekly Cognitive Report", sender: "system@nexus.ai", priority: "medium" as const, timestamp: "1h ago" },
    { id: "3", subject: "New Project Proposal: Quantum Memory", sender: "sara@research.io", priority: "low" as const, timestamp: "3h ago" },
  ];

  const mockActions = {
    doNow: [
      { id: "a1", title: "Review ALEX's architecture feedback", source: "GMAIL" },
      { id: "a2", title: "Finalize Decision Engine logic", source: "INTERNAL" },
    ],
    doNext: [
      { id: "b1", title: "Setup Notion API webhooks", source: "NOTION" },
      { id: "b2", title: "Update system documentation", source: "DOCS" },
    ],
    later: [
      { id: "c1", title: "Research multi-modal ingestion", source: "RESEARCH" },
    ],
  };

  return (
    <div className="min-h-screen pt-20 px-6 max-w-7xl mx-auto pb-24">
      <header className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2"
            >
              <Globe className="w-3 h-3" /> External Input Hub
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tighter"
            >
              Integrations
            </motion.h1>
          </div>
          <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
            <RefreshCcw className="w-4 h-4 mr-2" /> Sync All
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Data Sources */}
        <div className="lg:col-span-7 space-y-12">
          {/* Gmail Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Gmail</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Thread Monitoring</p>
                </div>
              </div>
              {!isGmailConnected ? (
                <Button onClick={() => setIsGmailConnected(true)} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6">
                  Connect Gmail
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  CONNECTED
                </div>
              )}
            </div>

            {isGmailConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEmails.map((email, i) => (
                  <GmailCard key={email.id} {...email} delay={i * 0.1} />
                ))}
                <button className="flex flex-col items-center justify-center p-5 border border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-all group">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-muted-foreground">Add Filter</span>
                </button>
              </div>
            )}
          </section>

          {/* Notion/Notes Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notes & Documents</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Knowledge Base Ingestion</p>
                </div>
              </div>
              <Button variant="secondary" className="rounded-full px-6 gap-2">
                <LinkIcon className="w-4 h-4" /> Connect Notion
              </Button>
            </div>
            
            <UploadBox onUpload={(files) => console.log("Uploaded", files)} />
          </section>
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 glass rounded-2xl border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
              <h2 className="text-xl font-black tracking-tight mb-6">Action Intelligence</h2>
              <ActionPanel {...mockActions} />
            </div>

            <div className="p-6 glass rounded-2xl border-white/5 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to synthesize these inputs into a decision?
              </p>
              <Button className="w-full rounded-xl py-6 font-bold shadow-lg shadow-primary/20">
                Launch Decision Engine
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
