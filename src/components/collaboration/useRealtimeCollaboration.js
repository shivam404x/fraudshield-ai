import { useState, useEffect, useRef, useCallback } from 'react';

export function useRealtimeCollaboration({
  projectId = 'default-deck',
  currentUser = { id: 'user-me', name: 'You', role: 'Editor' },
  onRemoteSlideUpdate,
  onRemoteElementUpdate,
  onRemoteAddElement,
  onRemoteDeleteElement,
  onRemoteAddSlide,
  onRemoteDeleteSlide,
  onRemoteMoveSlide
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [remoteSelections, setRemoteSelections] = useState({}); // elementId -> { userName, color }
  const [permissionError, setPermissionError] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Initialize and maintain WebSocket connection
  useEffect(() => {
    let isMounted = true;

    function connect() {
      // Connect to same host via Vite /ws proxy or directly to 5000
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setPermissionError(null);

          // Send JOIN message
          ws.send(JSON.stringify({
            type: 'JOIN',
            projectId,
            user: currentUser
          }));
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'ROOM_JOINED' || data.type === 'USER_JOINED' || data.type === 'USER_LEFT') {
              if (data.activeUsers) {
                setActiveUsers(data.activeUsers);
              }
            } else if (data.type === 'ELEMENT_SELECTED') {
              setRemoteSelections(prev => ({
                ...prev,
                [data.elementId]: {
                  userName: data.user?.name || 'Collaborator',
                  color: data.user?.color || '#4F46E5'
                }
              }));
            } else if (data.type === 'ELEMENT_DESELECTED') {
              setRemoteSelections(prev => {
                const next = { ...prev };
                delete next[data.elementId];
                return next;
              });
            } else if (data.type === 'UPDATE_SLIDE_BROADCAST') {
              if (onRemoteSlideUpdate) {
                onRemoteSlideUpdate(data.payload.slideIndex, data.payload.updates);
              }
            } else if (data.type === 'UPDATE_ELEMENT_BROADCAST') {
              if (onRemoteElementUpdate) {
                onRemoteElementUpdate(data.payload.slideIndex, data.payload.elementId, data.payload.updates);
              }
            } else if (data.type === 'ADD_ELEMENT_BROADCAST') {
              if (onRemoteAddElement) {
                onRemoteAddElement(data.payload.slideIndex, data.payload.element);
              }
            } else if (data.type === 'DELETE_ELEMENT_BROADCAST') {
              if (onRemoteDeleteElement) {
                onRemoteDeleteElement(data.payload.slideIndex, data.payload.elementId);
              }
            } else if (data.type === 'ADD_SLIDE_BROADCAST') {
              if (onRemoteAddSlide) {
                onRemoteAddSlide(data.payload.slide);
              }
            } else if (data.type === 'DELETE_SLIDE_BROADCAST') {
              if (onRemoteDeleteSlide) {
                onRemoteDeleteSlide(data.payload.slideIndex);
              }
            } else if (data.type === 'MOVE_SLIDE_BROADCAST') {
              if (onRemoteMoveSlide) {
                onRemoteMoveSlide(data.payload.fromIndex, data.payload.toIndex);
              }
            } else if (data.type === 'PERMISSION_DENIED') {
              setPermissionError(data.message);
              setTimeout(() => setPermissionError(null), 4000);
            }
          } catch (e) {
            console.error('[WS Parse Error]:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          // Try reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };

      } catch (err) {
        console.warn('[WS Connection Error]:', err);
        reconnectTimeoutRef.current = setTimeout(connect, 4000);
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [projectId]);

  // Outgoing broadcast helper
  const sendMessage = useCallback((type, payload = {}) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type,
        projectId,
        user: currentUser,
        payload
      }));
    }
  }, [projectId, currentUser]);

  const broadcastSlideUpdate = useCallback((slideIndex, updates) => {
    sendMessage('UPDATE_SLIDE', { slideIndex, updates });
  }, [sendMessage]);

  const broadcastElementUpdate = useCallback((slideIndex, elementId, updates) => {
    sendMessage('UPDATE_ELEMENT', { slideIndex, elementId, updates });
  }, [sendMessage]);

  const broadcastSelectElement = useCallback((elementId) => {
    sendMessage('SELECT_ELEMENT', { elementId });
  }, [sendMessage]);

  const broadcastDeselectElement = useCallback((elementId) => {
    sendMessage('DESELECT_ELEMENT', { elementId });
  }, [sendMessage]);

  const broadcastAddElement = useCallback((slideIndex, element) => {
    sendMessage('ADD_ELEMENT', { slideIndex, element });
  }, [sendMessage]);

  const broadcastDeleteElement = useCallback((slideIndex, elementId) => {
    sendMessage('DELETE_ELEMENT', { slideIndex, elementId });
  }, [sendMessage]);

  const broadcastAddSlide = useCallback((slide) => {
    sendMessage('ADD_SLIDE', { slide });
  }, [sendMessage]);

  const broadcastDeleteSlide = useCallback((slideIndex) => {
    sendMessage('DELETE_SLIDE', { slideIndex });
  }, [sendMessage]);

  const broadcastMoveSlide = useCallback((fromIndex, toIndex) => {
    sendMessage('MOVE_SLIDE', { fromIndex, toIndex });
  }, [sendMessage]);

  return {
    isConnected,
    activeUsers,
    remoteSelections,
    permissionError,
    broadcastSlideUpdate,
    broadcastElementUpdate,
    broadcastSelectElement,
    broadcastDeselectElement,
    broadcastAddElement,
    broadcastDeleteElement,
    broadcastAddSlide,
    broadcastDeleteSlide,
    broadcastMoveSlide
  };
}
