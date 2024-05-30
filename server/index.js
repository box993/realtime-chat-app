import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './models/databaseConnection.js'; // MongoDB connection
import getUserController from './controller/getUserController.js';
import getChatsController from './controller/getChatsController.js';
import getChatMessagesController from './controller/getChatMessagesController.js';
import getMoreMessagesController from './controller/getMoreMessagesController.js';
import handleMessage from './logics/handleMessageReceive.js';
import handleLogout from './controller/handleLogout.js';
import handleStatus from './controller/handleStatus.js';
import handleSearchController from './controller/handleSearchController.js';
import handleLogin from './controller/handleLogin.js';
import handleRegister from './controller/handleRegister.js';
import isAuthenticated from './controller/isAuthenticated.js';
import http from 'http';
import { Server } from 'socket.io';
import getAiResponse from './controller/getAiResponse.js';

dotenv.config();

class ChatApp {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3001;
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: 'http://localhost:3000', // Replace with your client URL
        methods: ['GET', 'POST'],
      },
    });
    this.setupSocketIO();
    this.middlewares();
    this.routes();
    this.connectDB();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.post('/login', handleLogin);
    this.app.post('/register', handleRegister);
    this.app.use(isAuthenticated);
    this.app.post('/logout', handleLogout);
    this.app.get('/getUser', getUserController);
    this.app.get('/getChats', getChatsController);
    this.app.get('/getChatMessages', getChatMessagesController);
    this.app.post('/handleStatus', handleStatus);
    this.app.get('/handleSearch', handleSearchController);
    this.app.post('/getMoreMessages', getMoreMessagesController);
    this.app.post('/getAiResponse', getAiResponse);
  }

  async connectDB() {
    try {
      await connectDB();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1); // Exit process with failure
    }
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      // Receive a new message from a client
      socket.on('send-message', async (data) => {
        const { message, senderId, chatId } = data;
        if (!chatId || !message || !senderId) {
          return;
        }
        console.log(
          `Message received from ${senderId} to ${chatId}: ${message}`
        );
        const { members, messageObj } = await handleMessage(
          message,
          chatId,
          senderId
        );
        console.log(members);
        // Broadcast the message to all connected clients
        this.io.emit('receive-message', {
          messageObj,
          receiverIds: members,
          chatId,
        });
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }

  startServer() {
    this.server.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

// Create an instance of ChatApp and start the server
const chatApp = new ChatApp();
chatApp.startServer();
