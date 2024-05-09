import React, { useState, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvder";
import peer from "../service/peer.js";
import HandShake from "../assets/handshake.jpg";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setremoteSocketId] = useState(null);
  const [myStream, setmyStream] = useState(null);
  const [remoteStream, setremoteStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setremoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setremoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setmyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      await peer.setLocalDescription(ans);
      console.log("Call Accepted!");
    },
    []
  );

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      const remoteStream = e.streams[0];
      console.log("GOT TRACKS!!");
      setremoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    // registration
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    //   deregister--
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setmyStream(stream);
  }, [socket, remoteSocketId]);

  return (
    <div className="container flex flex-col gap-8 justify-center items-center mx-auto p-4 min-h-screen">
      <div className="bg-white text-purple-700 border-2 border-white rounded-md px-8 py-4 text-3xl font-bold">
        <img src={HandShake} alt="logo" className="h-12" />
        Peer Connector
      </div>
      <div className="bg-white border-black border-2 w-[75vw] min-h-[50vh] rounded-md mx-auto text-center">
        <button className="text-2xl text-center font-bold mb-4 bg-gray-700 text-white rounded-md py-2 px-8 mt-4">
          Room
        </button>
        <h4 className="mb-4">
          {remoteSocketId ? "" : "No one in room"}
        </h4>
        <div className="flex justify-center gap-4">
          {myStream && (
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded"
              onClick={() => {}}
            >
              Send Your Video
            </button>
          )}
          {remoteSocketId && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={handleCallUser}
            >
              Call Another Person
            </button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:gap-8 mt-4">
          {myStream && (
            <div className="mb-4 p-2 border-2 border-black lg:w-1/2 flex flex-col items-center">
              <h1 className="text-xl font-bold mb-2">My Video</h1>
              <ReactPlayer
                playing
                muted
                height="200px"
                width="100%"
                style={{ maxWidth: "400px" }}
                url={URL.createObjectURL(myStream)}
              />
            </div>
          )}
          {remoteStream && (
            <div className="mb-4 p-2 border-2 border-black lg:w-1/2 flex flex-col items-center">
              <h1 className="text-xl font-bold mb-2">
                Another Person's Video
              </h1>
              <ReactPlayer
                playing
                muted
                height="200px"
                width="100%"
                style={{ maxWidth: "400px" }}
                url={URL.createObjectURL(remoteStream)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
