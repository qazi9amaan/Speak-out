import React from "react";
import { FaGlobe, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createroom } from "../../../http";
import s from "./AddRoomModel.module.css";

function AddRoomModel(props) {
  const { onClose } = props;
  const navigate = useNavigate();

  const [modelState, setmodelState] = React.useState({
    type: "",
    topic: "",
  });

  const { type, topic } = modelState;

  const changeRoomType = async (type) => {
    if (!topic) return;

    setmodelState({ ...modelState, type });

    try {
      const { data } = await createroom({ type, topic });
      if (data) navigate(`/room/${data.id}`);
    } catch (e) {
      console.log(e);
      setmodelState({ ...modelState, type: "" });
    }
  };

  const onTopicChangeHandler = (e) => {
    setmodelState({ ...modelState, topic: e.target.value });
  };

  return (
    <div className={s.modelWrapper}>
      <div className={s.model}>
        <button onClick={onClose} className={s.closeButton}>
          x
        </button>
        <textarea
          autoFocus
          onChange={onTopicChangeHandler}
          rows={3}
          type="text"
          value={topic}
          placeholder="You’ll speaking on what topic? Let’s others know before they join.."
        />
        <div className={s.modelFooter}>
          <span>I accept all the terms & conditions.</span>
          <div className={s.buttonWrapper}>
            <div
              onClick={() => {
                changeRoomType("private");
              }}
              className={
                type === "private" ? s.button__active : s.button__inactive
              }
            >
              <FaLock />
            </div>
            <div
              onClick={() => {
                changeRoomType("public");
              }}
              className={
                type === "public" ? s.button__active : s.button__inactive
              }
            >
              <FaGlobe />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRoomModel;
