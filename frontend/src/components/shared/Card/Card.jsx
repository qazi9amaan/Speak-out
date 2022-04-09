import React from "react";
import s from "./Card.module.css";

function Card({ children }) {
  return (
    <div className={s.card}>
      <div className={s.cardBody}>{children}</div>
    </div>
  );
}

export default Card;
