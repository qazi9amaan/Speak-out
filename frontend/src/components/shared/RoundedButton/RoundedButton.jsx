import React from "react";
import s from "./RoundedButton.module.css";

function RoundedButton(props) {
  const { name, onClick, disabled } = props;
  return (
    <button disabled={disabled} onClick={onClick} className={s.btn}>
      {name}
    </button>
  );
}

export default RoundedButton;
