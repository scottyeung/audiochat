
# Chatroom App with Audio Upload and Voting

This is a full-stack TypeScript application for a chatroom that allows users to chat in real-time and upload audio files via S3. Users can pick a username, password, and chatroom name to join. Uploaded audio files can be approved by user voting.

## Features

- User registration and authentication
- Real-time chatroom functionality using Socket.IO
- Audio file upload to S3
- User voting for approving uploaded audio files
- SQLite database for storing user and chatroom data

## Routes

- `/api/register` (POST): Register a new user
- `/api/login` (POST): User login
- `/api/chatrooms` (GET): Get list of available chatrooms
- `/api/chatrooms` (POST): Create a new chatroom
- `/api/chatrooms/:id` (GET): Get details of a specific chatroom
- `/api/chatrooms/:id/join` (POST): Join a chatroom
- `/api/chatrooms/:id/messages` (GET): Get messages in a chatroom
- `/api/chatrooms/:id/audio` (POST): Upload audio file to a chatroom
- `/api/chatrooms/:id/audio/:audioId/vote` (POST): Vote for an audio file

## Usage

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   bun server/run.ts
   ```

3. Open the application in your browser at `http://localhost:8001`.

## Technologies Used

- Backend:
  - Node.js
  - TypeScript
  - Express.js
  - Socket.IO
  - SQLite (sqlite3 library)

- Frontend:
  - React 18
  - TypeScript
  - Socket.IO Client

