
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Chatroom, CreateChatroomRequest } from '../../shared/types';

export const ChatroomList: React.FC = () => {
  const history = useHistory();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [chatroomName, setChatroomName] = useState('');

  useEffect(() => {
    fetchChatrooms();
  }, []);

  const fetchChatrooms = async () => {
    try {
      const response = await fetch('/api/chatrooms');
      if (response.ok) {
        const data = await response.json();
        setChatrooms(data.chatrooms);
      } else {
        console.error('Failed to fetch chatrooms');
      }
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
  };

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    const createChatroomRequest: CreateChatroomRequest = { name: chatroomName };
    try {
      const response = await fetch('/api/chatrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createChatroomRequest),
      });
      if (response.ok) {
        fetchChatrooms();
        setChatroomName('');
      } else {
        console.error('Failed to create chatroom');
      }
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  const handleJoinChatroom = async (chatroomId: string) => {
    try {
      const response = await fetch(`/api/chatrooms/${chatroomId}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        history.push(`/chatroom/${chatroomId}`);
      } else {
        console.error('Failed to join chatroom');
      }
    } catch (error) {
      console.error('Error joining chatroom:', error);
    }
  };

  return (
    <div>
      <h1>Chatrooms</h1>
      <form onSubmit={handleCreateChatroom}>
        <input
          type="text"
          value={chatroomName}
          onChange={(e) => setChatroomName(e.target.value)}
          placeholder="Chatroom name"
          required
        />
        <button type="submit">Create Chatroom</button>
      </form>
      <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
            {chatroom.name}
            <button onClick={() => handleJoinChatroom(chatroom.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

