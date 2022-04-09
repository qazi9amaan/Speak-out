import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RoomControlBar from "../../components/RoomControlBar/RoomControlBar";
import Speaker from "../../components/Speaker/Speaker";
import { useWebRTC } from "../../hooks/useWebRTC";
import s from "./Room.module.css";
import { useSelector } from "react-redux";
import { getRooms } from "../../http";

function Room() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(id, user);

  const [roomDetails, setRoomDetails] = useState(null);

  React.useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRooms(id);
      setRoomDetails((prev) => data);
    };

    fetchRoom();
  }, [id]);

  return (
    <div className={s.roomWrapper}>
      <RoomControlBar
        socketUser={user}
        handleMute={handleMute}
        roomDetails={roomDetails}
        client={clients[0]}
      />
      <section className={s.firstSection}>
        <div className={s.speakerSectionWrapper}>
          <div>
            <p className={s.speakerSectionheader}>Audience</p>
            <div className={s.speakerSection}>
              {clients.map((_client, i) => (
                <Speaker
                  provideRef={provideRef}
                  user={user}
                  key={i}
                  handleMute={handleMute}
                  client={_client}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={s.cardWrapper}>
          <div className={s.card}>
            <div className={s.cardBody}>
              <div className={s.messageWrapper}>
                <img
                  src="http://localhost:5100/storage/1647809869559-406409311.png"
                  alt=""
                />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                  aperiam deserunt corrupti perferendis debitis ipsa incidunt!
                  Voluptatem, quae hic? Ratione?
                </p>
              </div>
              <div className={s.messageWrapper}>
                <img
                  src="http://localhost:5100/storage/1647809869559-406409311.png"
                  alt=""
                />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                  aperiam deserunt corrupti perferendis debitis ipsa incidunt!
                  Voluptatem, quae hic? Ratione?
                </p>
              </div>

              <div className={s.sendMessageInputWrapper}>
                <textarea
                  rows={3}
                  type="text"
                  placeholder="Type your message here and press enter to share it"
                />
                <div className={s.raisehand}>
                  <span>✋</span>
                  Raise hand
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Room;
