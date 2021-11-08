import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage,
  StrokeSegment,
  UserData,
  RoomData,
  RoomCreationData,
  RoomRequestData,
} from '@artfair/common';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

const users = new Map<string, UserData>();
const rooms = new Map<string, RoomData>();

app.use('/', express.static(root));
app.use('*', express.static(root));

const usernameIsTaken = (username: string, room: string) => {
  const roomData = rooms.get(room);
  return roomData && roomData.members.has(username);
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (data: RoomCreationData) => {
    if (rooms.has(data.room)) {
      socket.emit('room_taken');
    } else {
      const userData: UserData = { name: data.username, room: data.room };
      const roomData: RoomData = {
        name: data.room,
        members: new Set([data.username]),
      };
      users.set(socket.id, userData);
      rooms.set(data.room, roomData);
      socket.join(data.room);
      socket.emit('room_created', {
        username: data.username,
        room: data.room,
        host: true,
        players: Array.from(roomData.members),
      });
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (data: RoomRequestData) => {
    if (!rooms.has(data.room)) {
      socket.emit('room_does_not_exist');
    } else if (usernameIsTaken(data.username, data.room)) {
      socket.emit('username_taken');
    } else {
      const userData: UserData = { name: data.username, room: data.room };
      const roomData = rooms.get(data.room);
      if (!roomData) return;
      users.set(socket.id, userData);
      roomData.members.add(data.username);
      socket.join(data.room);
      socket.emit('room_joined', {
        username: data.username,
        room: data.room,
        players: Array.from(roomData.members),
      });
      socket.broadcast.to(data.room).emit('user_join', data.username);
    }
  });
};

const addStartGameListener = (socket: Socket) => {
  socket.on('start_game', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('start_game');
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('user_leave', userData.name);

    const roomData = rooms.get(userData.room);
    if (!roomData) return;

    // Remove user from room and delete room if everybody has left
    roomData.members.delete(userData.name);
    if (roomData.members.size === 0) {
      rooms.delete(userData.room);
    }

    users.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('chat_message', message);
  });
};

const addDrawSegmentListener = (socket: Socket) => {
  socket.on('draw_segment', (segment: StrokeSegment) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('draw_segment', segment);
  });
};

const addClearCanvasListener = (socket: Socket) => {
  socket.on('clear_canvas', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('clear_canvas');
  });
};

io.on('connection', (socket) => {
  addCreateRoomAttemptListener(socket);
  addJoinRoomAttemptListener(socket);
  addUserLeaveListener(socket);
  addChatMessageListener(socket);
  addDrawSegmentListener(socket);
  addStartGameListener(socket);
  addClearCanvasListener(socket);
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
