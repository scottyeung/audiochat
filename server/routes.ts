
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User, Chatroom, Message, AudioFile, RegisterRequest, LoginRequest, CreateChatroomRequest, JoinChatroomRequest, UploadAudioRequest, VoteAudioRequest } from '../shared/types';
import { createUser, getUserByUsername, getChatroomById, createMessage, getMessagesByChatroomId, createAudioFile, getAudioFileById, updateAudioFileVotes, updateAudioFileApproval } from './db';
import { uploadToS3 } from './s3';

export const registerUser = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const newUser: User = {
      id: uuidv4(),
      username,
      password,
    };
    await createUser(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createChatroom = async (req: Request<{}, {}, CreateChatroomRequest>, res: Response) => {
  try {
    const { name } = req.body;
    const newChatroom: Chatroom = {
      id: uuidv4(),
      name,
      users: [],
    };
    await createChatroom(newChatroom);
    res.status(201).json({ message: 'Chatroom created successfully', chatroom: newChatroom });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChatrooms = async (req: Request, res: Response) => {
  try {
    const chatrooms = await getChatrooms();
    res.status(200).json({ chatrooms });
  } catch (error) {
    console.error('Error getting chatrooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const joinChatroom = async (req: Request<{ id: string }, {}, JoinChatroomRequest>, res: Response) => {
  try {
    const { id } = req.params;
    const chatroom = await getChatroomById(id);
    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }
    res.status(200).json({ message: 'Joined chatroom successfully', chatroom });
  } catch (error) {
    console.error('Error joining chatroom:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await getMessagesByChatroomId(id);
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadAudio = async (req: Request<{ id: string }, {}, UploadAudioRequest>, res: Response) => {
  try {
    const { id } = req.params;
    const { audioFile } = req.body;
    const chatroom = await getChatroomById(id);
    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }
    const audioUrl = await uploadToS3(audioFile);
    const newAudioFile: AudioFile = {
      id: uuidv4(),
      userId: '', // TODO: Get the user ID from the authenticated user
      chatroomId: id,
      url: audioUrl,
      votes: 0,
      approved: false,
    };
    await createAudioFile(newAudioFile);
    res.status(201).json({ message: 'Audio file uploaded successfully', audioFile: newAudioFile });
  } catch (error) {
    console.error('Error uploading audio file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const voteAudio = async (req: Request<{ id: string; audioId: string }, {}, VoteAudioRequest>, res: Response) => {
  try {
    const { id, audioId } = req.params;
    const audioFile = await getAudioFileById(audioId);
    if (!audioFile) {
      return res.status(404).json({ error: 'Audio file not found' });
    }
    const updatedVotes = audioFile.votes + 1;
    await updateAudioFileVotes(audioId, updatedVotes);
    if (updatedVotes >= 5) {
      await updateAudioFileApproval(audioId, true);
    }
    res.status(200).json({ message: 'Audio file voted successfully', audioFile });
  } catch (error) {
    console.error('Error voting for audio file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

