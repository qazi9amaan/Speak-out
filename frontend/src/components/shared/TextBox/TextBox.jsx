import React from "react";
import s from "./TextBox.module.css";

function TextBox({ ...props }) {
  return <input className={s.input} {...props} />;
}

export default TextBox;
