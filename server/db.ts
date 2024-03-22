
import sqlite3 from 'sqlite3';
import { User, Chatroom, Message, AudioFile } from '../shared/types';

const db = new sqlite3.Database(':memory:');

export const initializeDatabase = () => {
  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE chatrooms (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE messages (
      id TEXT PRIMARY KEY,
      userId TEXT,
      chatroomId TEXT,
      content TEXT,
      timestamp TEXT,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (chatroomId) REFERENCES chatrooms(id)
    )
  `);

  db.run(`
    CREATE TABLE audioFiles (
      id TEXT PRIMARY KEY,
      userId TEXT,
      chatroomId TEXT,
      url TEXT,
      votes INTEGER,
      approved BOOLEAN,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (chatroomId) REFERENCES chatrooms(id)
    )
  `);
};

export const createUser = (user: User) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      [user.id, user.username, user.password],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const getUserByUsername = (username: string) => {
  return new Promise<User | undefined>((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as User);
      }
    });
  });
};

export const createChatroom = (chatroom: Chatroom) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      'INSERT INTO chatrooms (id, name) VALUES (?, ?)',
      [chatroom.id, chatroom.name],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const getChatrooms = () => {
  return new Promise<Chatroom[]>((resolve, reject) => {
    db.all('SELECT * FROM chatrooms', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Chatroom[]);
      }
    });
  });
};

export const getChatroomById = (id: string) => {
  return new Promise<Chatroom | undefined>((resolve, reject) => {
    db.get('SELECT * FROM chatrooms WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as Chatroom);
      }
    });
  });
};

export const createMessage = (message: Message) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      'INSERT INTO messages (id, userId, chatroomId, content, timestamp) VALUES (?, ?, ?, ?, ?)',
      [message.id, message.userId, message.chatroomId, message.content, message.timestamp],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const getMessagesByChatroomId = (chatroomId: string) => {
  return new Promise<Message[]>((resolve, reject) => {
    db.all('SELECT * FROM messages WHERE chatroomId = ?', [chatroomId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Message[]);
      }
    });
  });
};

export const createAudioFile = (audioFile: AudioFile) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      'INSERT INTO audioFiles (id, userId, chatroomId, url, votes, approved) VALUES (?, ?, ?, ?, ?, ?)',
      [audioFile.id, audioFile.userId, audioFile.chatroomId, audioFile.url, audioFile.votes, audioFile.approved],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const getAudioFileById = (id: string) => {
  return new Promise<AudioFile | undefined>((resolve, reject) => {
    db.get('SELECT * FROM audioFiles WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as AudioFile);
      }
    });
  });
};

export const updateAudioFileVotes = (id: string, votes: number) => {
  return new Promise<void>((resolve, reject) => {
    db.run('UPDATE audioFiles SET votes = ? WHERE id = ?', [votes, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const updateAudioFileApproval = (id: string, approved: boolean) => {
  return new Promise<void>((resolve, reject) => {
    db.run('UPDATE audioFiles SET approved = ? WHERE id = ?', [approved, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

