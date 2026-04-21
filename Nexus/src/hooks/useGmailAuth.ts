import { useEffect, useState } from 'react';
import { useNexusStore } from '../store/nexusStore';

export const useGmailAuth = () => {
  const { isGmailConnected, setGmailConnected } = useNexusStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect callback from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmailStatus = params.get('gmail');
    
    if (gmailStatus === 'connected') {
      setGmailConnected(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (gmailStatus === 'error') {
      const reason = params.get('reason') || 'unknown';
      setError(`Failed to connect Gmail: ${reason}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setGmailConnected]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/integrations/gmail/connect');
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No auth URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate connection');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setGmailConnected(false);
    // In production, also call backend to revoke tokens
  };

  return {
    isConnected: isGmailConnected,
    isConnecting,
    error,
    connect,
    disconnect
  };
};
