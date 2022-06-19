import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import { RoomProvider } from './context/RoomContext';
import { UserProvider } from './context/UserContext';
import { Home } from './pages/Home';
import { Room } from './pages/Room';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:id' element={<Room />} />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
