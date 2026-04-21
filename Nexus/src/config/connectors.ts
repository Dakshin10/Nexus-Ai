import { Mail, StickyNote, HardDrive, Calendar } from 'lucide-react';

export interface ConnectorConfig {
  id: string;
  name: string;
  icon: any; // Can be a Lucide component or a string key
  description: string;
  authUrl: string;
  color: string;
  isReady: boolean;
}

export const CONNECTORS: ConnectorConfig[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    description: 'Sync official communications, threads, and urgent requests.',
    authUrl: 'http://localhost:3001/auth/gmail',
    color: 'rose',
    isReady: true
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: StickyNote,
    description: 'Import workspace pages, task lists, and project docs.',
    authUrl: 'http://localhost:3001/auth/notion',
    color: 'emerald',
    isReady: true
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'slack', // Using safe string key (handled by ConnectorIcon)
    description: 'Coming Soon: Direct message synthesis and channel monitoring.',
    authUrl: '#',
    color: 'purple',
    isReady: false
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    icon: HardDrive,
    description: 'Coming Soon: Semantic search across your cloud documents.',
    authUrl: '#',
    color: 'amber',
    isReady: false
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    description: 'Coming Soon: Temporal prioritization and event synthesis.',
    authUrl: '#',
    color: 'blue',
    isReady: false
  }
];
