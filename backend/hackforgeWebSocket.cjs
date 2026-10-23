/**
 * HackForge AI — Real-Time WebSocket Collaboration Server
 * Manages live multi-user synchronization, presence, element locking,
 * and server-enforced role permissions (Admin, Editor, Viewer).
 */

const { WebSocketServer } = require('ws');

// Room Map: projectId -> Set of client objects
// client: { ws, projectId, user: { id, name, email, avatar, role, color }, selectedElementId }
const rooms = new Map();

const COLLABORATOR_COLORS = [
  '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', 
  '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6'
];

function initWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/ws' || url.pathname === '/ws/collaborate') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws) => {
    let clientSession = null;

    ws.on('message', (messageRaw) => {
      try {
        const msg = JSON.parse(messageRaw);
        const { type, projectId, user, payload } = msg;

        // 1. JOIN ROOM
        if (type === 'JOIN') {
          const roomKey = projectId || 'default-deck';
          if (!rooms.has(roomKey)) {
            rooms.set(roomKey, new Set());
          }

          const room = rooms.get(roomKey);
          const color = COLLABORATOR_COLORS[room.size % COLLABORATOR_COLORS.length];

          clientSession = {
            ws,
            projectId: roomKey,
            user: {
              id: user?.id || `user-${Date.now()}`,
              name: user?.name || 'Anonymous Hacker',
              email: user?.email || '',
              avatar: user?.avatar || (user?.name ? user.name.charAt(0).toUpperCase() : 'H'),
              role: user?.role || 'Editor', // 'Viewer' | 'Editor' | 'Admin'
              color
            },
            selectedElementId: null
          };

          room.add(clientSession);

          // Send current presence list to joining user
          const activeUsers = Array.from(room).map(c => c.user);
          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            projectId: roomKey,
            currentUser: clientSession.user,
            activeUsers
          }));

          // Broadcast to other peers that user joined
          broadcastToRoom(roomKey, ws, {
            type: 'USER_JOINED',
            user: clientSession.user,
            activeUsers
          });

          return;
        }

        if (!clientSession) return;
        const currentRoomKey = clientSession.projectId;

        // 2. ELEMENT SELECTION (Who is currently editing what)
        if (type === 'SELECT_ELEMENT') {
          clientSession.selectedElementId = payload.elementId;
          broadcastToRoom(currentRoomKey, ws, {
            type: 'ELEMENT_SELECTED',
            elementId: payload.elementId,
            user: clientSession.user
          });
          return;
        }

        if (type === 'DESELECT_ELEMENT') {
          clientSession.selectedElementId = null;
          broadcastToRoom(currentRoomKey, ws, {
            type: 'ELEMENT_DESELECTED',
            elementId: payload.elementId,
            user: clientSession.user
          });
          return;
        }

        // 3. EDIT ACTIONS (Check Role: Viewers are blocked)
        if (clientSession.user.role === 'Viewer') {
          ws.send(JSON.stringify({
            type: 'PERMISSION_DENIED',
            message: 'You have Viewer access only. Changes are not permitted.'
          }));
          return;
        }

        // 4. REAL-TIME BROADCAST OF SLIDE & ELEMENT UPDATES
        if (type === 'UPDATE_SLIDE' || 
            type === 'UPDATE_ELEMENT' || 
            type === 'ADD_ELEMENT' || 
            type === 'DELETE_ELEMENT' || 
            type === 'ADD_SLIDE' || 
            type === 'DELETE_SLIDE' || 
            type === 'MOVE_SLIDE' ||
            type === 'APPLY_LAYOUT') {
          
          broadcastToRoom(currentRoomKey, ws, {
            type: `${type}_BROADCAST`,
            payload,
            user: clientSession.user,
            timestamp: Date.now()
          });
        }

      } catch (err) {
        console.error('[WS Message Error]:', err.message);
      }
    });

    ws.on('close', () => {
      if (clientSession) {
        const { projectId, user } = clientSession;
        const room = rooms.get(projectId);
        if (room) {
          room.delete(clientSession);
          if (room.size === 0) {
            rooms.delete(projectId);
          } else {
            const activeUsers = Array.from(room).map(c => c.user);
            broadcastToRoom(projectId, null, {
              type: 'USER_LEFT',
              user,
              activeUsers
            });
          }
        }
      }
    });

    ws.on('error', (err) => {
      console.warn('[WS Socket Error]:', err.message);
    });
  });

  console.log('⚡ HackForge Real-Time Collaboration WebSocket Server Attached.');
  return wss;
}

function broadcastToRoom(roomKey, senderWs, data) {
  const room = rooms.get(roomKey);
  if (!room) return;

  const payload = JSON.stringify(data);
  room.forEach(client => {
    if (client.ws !== senderWs && client.ws.readyState === 1) { // 1 = OPEN
      client.ws.send(payload);
    }
  });
}

module.exports = {
  initWebSocketServer
};
