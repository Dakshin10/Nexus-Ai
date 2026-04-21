import { useEffect, useState } from 'react';
import { useNexusStore } from '../store/nexusStore';

export const useNotionAuth = () => {
  const { isNotionConnected, setNotionConnected, currentUser } = useNexusStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for OAuth success via postMessage
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Ensure the message fits our requirements
      if (event.origin !== "http://localhost:3001") return;

      if (event.data?.type === "notion_connected") {
        console.log("✅ Notion connected");
        setNotionConnected(true);
        localStorage.setItem("notion_connected", "true");
        setIsConnecting(false);

        // Verify status from backend
        fetch(`http://localhost:3001/api/notion/status?userId=${currentUser.id}`)
          .then(res => res.json())
          .then(data => {
            console.log("Backend Notion status:", data);
          })
          .catch(err => console.error("Status check failed:", err));
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setNotionConnected, currentUser.id]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Initiate OAuth flow with userId state
      const authUrl = `http://localhost:3001/auth/notion?userId=${currentUser.id}`;
      
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        authUrl,
        "Notion OAuth",
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
      );

      // We wait for the message event to set isConnecting(false)
    } catch (err: any) {
      setError(err.message || 'Failed to initiate connection');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setNotionConnected(false);
    localStorage.removeItem("notion_connected");
    // Revoke token in backend here if needed
  };

  return {
    isConnected: isNotionConnected,
    isConnecting,
    error,
    connect,
    disconnect
  };
};
