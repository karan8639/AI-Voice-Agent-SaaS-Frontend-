import { useEffect, useState } from 'react';

/**
 * useCallStream hook to handle real-time call updates via SSE.
 * @param {Function} onMessage Callback function when a new message is received.
 */
export const useCallStream = (onMessage) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    
    // Native EventSource does not support standard headers.
    // We pass the JWT as a query parameter for authentication on the backend.
    const url = `${baseUrl}/calls/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      if (onMessage) {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
          // Return raw data if parsing fails
          onMessage(event.data);
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
      // EventSource automatically attempts to reconnect on error,
      // but we log it and update state.
    };

    // Cleanup: Ensure the stream properly closes when the component unmounts
    return () => {
      eventSource.close();
      setIsConnected(false);
      console.log('SSE connection closed');
    };
  }, [onMessage]);

  return { isConnected };
};
