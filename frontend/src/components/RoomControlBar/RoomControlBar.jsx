import React from "react";
import s from "./RoomControlBar.module.css";
import { FaArrowLeft, FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoomControlBar({ roomDetails, handleMute, socketUser, client }) {
  const { user } = useSelector((state) => state.auth);
  const [isMuted, setisMuted] = React.useState(true);
  React.useEffect(() => {
    handleMute(isMuted, socketUser.id);
  }, [isMuted]);

  const navigate = useNavigate();
  const leaveRoomHandler = () => {
    navigate("/rooms");
  };
  return (
    <nav className={s.nav}>
      <div className={s.roomDetailsWrapper}>
        <FaArrowLeft onClick={leaveRoomHandler} className={s.backIcon} />
        <div className={s.roomDetails}>
          <h3>{roomDetails?.topic}</h3>
          <p>Qazi is speaking ....</p>
        </div>
      </div>
      <div className={s.actionsWrapper}>
        <div onClick={() => setisMuted((prev) => !prev)}>
          {client?.muted ? (
            <FaMicrophoneSlash className={s.micIcon} />
          ) : (
            <FaMicrophone className={s.micIcon} />
          )}
        </div>
        <div onClick={leaveRoomHandler} className={s.iconbadge}>
          ✌ Leave quietly
        </div>
        <img
          className={s.profileImage}
          src={user.avatar}
          alt={user.name}
          style={{ width: "50px" }}
        />
      </div>
    </nav>
  );
}

export default RoomControlBar;
