import React, { useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket/index";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = React.useRef({});
  const connections = React.useRef({});
  const socket = React.useRef();
  const clientsRef = React.useRef([]);

  React.useEffect(() => {
    socket.current = socketInit();
  }, []);

  const localMediaStream = React.useRef(null);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingForClient = clients.find(
        (client) => client.id === newClient.id
      );
      if (lookingForClient === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  // capture audio
  React.useEffect(() => {
    const startCapture = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localMediaStream.current = stream;
    };
    startCapture().then(() => {
      addNewClient(
        {
          ...user,
          muted: true,
        },
        () => {
          const localElement = audioElements.current[user.id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = localMediaStream.current;
          }

          //  connect to other clients
          socket.current.emit(ACTIONS.JOIN, { roomId, user });
        }
      );
    });

    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());

      socket.current.emit(ACTIONS.LEAVE, { roomId, user });
    };
  }, []);

  // add a new peer
  React.useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //  if already connected to peer, ignore
      if (peerId in connections.current) {
        console.warn("already connected to peer");
        return;
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      // handle ontrack
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          const userAudioElement = audioElements.current[remoteUser.id];
          if (userAudioElement) {
            userAudioElement.srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              const userAudioElement = audioElements.current[remoteUser.id];
              if (userAudioElement) {
                userAudioElement.srcObject = remoteStream;
                settled = true;
              }

              if (settled) {
                clearInterval(interval);
                return;
              }
            }, 1000);
          }
        });
      };

      // add local track to remote peer
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      // create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sdp: offer,
        });
      }
    };
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  // handle new ice candidate
  React.useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate && peerId in connections.current) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // handle new sdp
  React.useEffect(() => {
    const handleRelaySdp = async ({ peerId, sdp: remotesdp }) => {
      if (peerId in connections.current) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remotesdp)
        );

        // if offer create answer
        if (remotesdp.type === "offer") {
          const answer = await connections.current[peerId].createAnswer();
          await connections.current[peerId].setLocalDescription(answer);
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sdp: answer,
          });
        }
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRelaySdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // handle peer leaving
  React.useEffect(() => {
    const handlePeerLeave = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[peerId];

      setClients((existingClients) =>
        existingClients.filter((client) => client.id !== userId)
      );
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handlePeerLeave);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  React.useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  // listen for mute/unmute
  React.useEffect(() => {
    const setMute = (mute, userID) => {
      const clientIDx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userID);

      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));

      if (clientIDx > -1) {
        connectedClients[clientIDx].muted = mute;
        setClients(connectedClients);
      }
    };

    socket.current.on(ACTIONS.MUTE, ({ userId }) => {
      setMute(true, userId);
    });

    socket.current.on(ACTIONS.UNMUTE, ({ userId }) => {
      setMute(false, userId);
    });

    return () => {
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UNMUTE);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  // Handling mute/unmute
  const handleMute = (isMuted, userId) => {
    let settled = false;
    const interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMuted;

        if (isMuted) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        } else {
          socket.current.emit(ACTIONS.UNMUTE, {
            roomId,
            userId,
          });
        }

        settled = true;
      }

      if (settled) {
        clearInterval(interval);
        return;
      }
    }, 1000);
  };

  return { clients, provideRef, handleMute };
};
