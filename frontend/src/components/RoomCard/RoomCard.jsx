import React from "react";
import s from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();
  const onRoomClickHandler = () => {
    navigate(`/room/${room.id}`);
  };
  return (
    <div onClick={onRoomClickHandler} className={s.roomItemHolder}>
      <h3 className={s.roomtitle}>{room.topic}</h3>
      <div className={s.roombody}>
        <div>
          {room.speakers.slice(0, 3).map((speaker, index) => (
            <img
              key={index}
              src={speaker.avatar}
              alt="room"
              className={index > 0 ? s.imageback : ""}
            />
          ))}
        </div>
        <span className={s.people_joined}>
          {room.speakers.length > 1
            ? `${room.speakers.length} people joined`
            : `${room.speakers.length} person joined`}
        </span>
      </div>
    </div>
  );
}

export default RoomCard;
