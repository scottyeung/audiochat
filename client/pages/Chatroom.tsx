
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Message, AudioFile, UploadAudioRequest, VoteAudioRequest } from '../../shared/types';

interface ChatroomProps {
  socket: Socket;
}

export const Chatroom: React.FC<ChatroomProps> = ({ socket }) => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [audioInput, setAudioInput] = useState<File | null>(null);

  useEffect(() => {
    fetchMessages();
    fetchAudioFiles();

    socket.emit('joinChatroom', id);

    socket.on('newMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveChatroom', id);
      socket.off('newMessage');
    };
  }, [id, socket]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${id}/audio`);
      if (response.ok) {
        const data = await response.json();
        setAudioFiles(data.audioFiles);
      } else {
        console.error('Failed to fetch audio files');
      }
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      const message: Message = {
        id: Date.now().toString(),
        userId: '', // TODO: Get the user ID from the authenticated user
        chatroomId: id,
        content: messageInput,
        timestamp: new Date(),
      };
      socket.emit('sendMessage', message);
      setMessageInput('');
    }
  };

  const handleUploadAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (audioInput) {
      const uploadAudioRequest: UploadAudioRequest = {
        chatroomId: id,
        audioFile: audioInput,
      };
      try {
        const response = await fetch(`/api/chatrooms/${id}/audio`, {
          method: 'POST',
          body: JSON.stringify(uploadAudioRequest),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          fetchAudioFiles();
          setAudioInput(null);
        } else {
          console.error('Failed to upload audio file');
        }
      } catch (error) {
        console.error('Error uploading audio file:', error);
      }
    }
  };

  const handleVoteAudio = async (audioId: string) => {
    const voteAudioRequest: VoteAudioRequest = {
      chatroomId: id,
      audioId,
    };
    try {
      const response = await fetch(`/api/chatrooms/${id}/audio/${audioId}/vote`, {
        method: 'POST',
        body: JSON.stringify(voteAudioRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchAudioFiles();
      } else {
        console.error('Failed to vote for audio file');
      }
    } catch (error) {
      console.error('Error voting for audio file:', error);
    }
  };

  return (
    <div>
      <h1>Chatroom: {id}</h1>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {message.content} - {message.timestamp}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message"
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div>
        <h2>Audio Files</h2>
        <ul>
          {audioFiles.map((audioFile) => (
            <li key={audioFile.id}>
              <audio src={audioFile.url} controls />
              <p>Votes: {audioFile.votes}</p>
              {!audioFile.approved && (
                <button onClick={() => handleVoteAudio(audioFile.id)}>Vote</button>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleUploadAudio}>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioInput(e.target.files?.[0] || null)}
            required
          />
          <button type="submit">Upload Audio</button>
        </form>
      </div>
    </div>
  );
};

