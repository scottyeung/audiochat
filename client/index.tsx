
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { io } from 'socket.io-client';
import './index.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChatroomList } from './pages/ChatroomList';
import { Chatroom } from './pages/Chatroom';

const socket = io();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/chatrooms" component={ChatroomList} />
        <Route path="/chatroom/:id" component={() => <Chatroom socket={socket} />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

