
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Chatroom {
  id: string;
  name: string;
  users: User[];
}

export interface Message {
  id: string;
  userId: string;
  chatroomId: string;
  content: string;
  timestamp: Date;
}

export interface AudioFile {
  id: string;
  userId: string;
  chatroomId: string;
  url: string;
  votes: number;
  approved: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateChatroomRequest {
  name: string;
}

export interface JoinChatroomRequest {
  chatroomId: string;
}

export interface UploadAudioRequest {
  chatroomId: string;
  audioFile: File;
}

export interface VoteAudioRequest {
  chatroomId: string;
  audioId: string;
}
