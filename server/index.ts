
import { app, server, io } from './run_express';
import { initializeDatabase } from './db';
import { registerUser, loginUser, createChatroom, getChatrooms, joinChatroom, getMessages, uploadAudio, voteAudio } from './routes';

// Initialize the database
initializeDatabase();

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinChatroom', (chatroomId: string) => {
    socket.join(chatroomId);
    console.log('User joined chatroom:', chatroomId);
  });

  socket.on('leaveChatroom', (chatroomId: string) => {
    socket.leave(chatroomId);
    console.log('User left chatroom:', chatroomId);
  });

  socket.on('sendMessage', (message: { chatroomId: string; content: string }) => {
    io.to(message.chatroomId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API routes
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.get('/api/chatrooms', getChatrooms);
app.post('/api/chatrooms', createChatroom);
app.get('/api/chatrooms/:id', getChatrooms);
app.post('/api/chatrooms/:id/join', joinChatroom);
app.get('/api/chatrooms/:id/messages', getMessages);
app.post('/api/chatrooms/:id/audio', uploadAudio);
app.post('/api/chatrooms/:id/audio/:audioId/vote', voteAudio);

