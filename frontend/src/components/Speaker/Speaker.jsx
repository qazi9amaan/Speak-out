import React from "react";
import { FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import s from "./Speaker.module.css";
function Speaker({ user, client, provideRef, handleMute }) {
  const [isMuted, setisMuted] = React.useState(true);
  React.useEffect(() => {
    handleMute(isMuted, user.id);
  }, [isMuted]);

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) return;
    setisMuted((prev) => !prev);
  };

  return (
    <div className={s.roomItemHolder}>
      <div className={s.avatarWrapper}>
        <img src={client.avatar} alt="user" />
        <audio
          ref={(instance) => {
            provideRef(instance, client.id);
          }}
          autoPlay
          // controls
        />
        <div
          onClick={() => {
            handleMuteClick(client.id);
          }}
          className={s.micIcon}
        >
          {client.muted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </div>
      </div>

      <h3>{client.name}</h3>
    </div>
  );
}

export default Speaker;
