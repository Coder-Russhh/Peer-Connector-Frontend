import React, { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvder";
import { useNavigate } from "react-router-dom";
import HandShake from "../assets/handshake.jpg";

const Lobby = () => {
  const [email, setemail] = useState("");
  const [room, setroom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handleRoomChange = (e) => {
    setroom(e.target.value);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", {
        email,
        room,
      });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    // multiple time render na ho component
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex flex-col gap-8 justify-center items-center">
      <div className="bg-white text-purple-700 border-2 border-white rounded-md px-8 py-4 text-3xl font-bold">
        <img src={HandShake} alt="logo" className="h-12" />
        Peer Connector
      </div>
      <div className="max-w-md mx-auto bg-white shadow-md border-black border-2 rounded-md p-8">
        <h2 className="text-2xl text-center bg-gray-700 text-white rounded-md font-semibold mb-4 p-2">
          Connect with Anyone
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email Id :-
            </label>
            <input
              type="email"
              value={email}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              onChange={handleEmailChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-gray-800"
            >
              Room Number :-
            </label>
            <input
              type="text"
              value={room}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              onChange={handleRoomChange}
            />
          </div>

          <div className="text-center">
            <button
              // type="button"
              className="bg-purple-600 text-white p-2 rounded-md hover:bg-green-600"
              // onClick={handleJoinRoomClick}
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
