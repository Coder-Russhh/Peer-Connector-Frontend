import React from 'react';
import { Routes,Route } from "react-router-dom";
import Lobby from './screens/Lobby';
import Room from './screens/Room';


const App = () => {
  return (
    <>
    <div className="bg-gradient-to-b from-purple-700 to-purple-400 min-h-screen">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
