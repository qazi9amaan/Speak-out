/* eslint-disable jsx-a11y/heading-has-content */
import React from "react";
import { logout } from "../../../http";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/slices/authSlice";
import { FaArrowRight } from "react-icons/fa";

function Navigation() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logoutUser = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <nav className={s.nav}>
      <div className={s.inputWrapper}>
        <input className={s.input} placeholder="Search for a room ..." />
      </div>
      <ul className={s.ul}>
        <li className={s.li}>
          <div className={s.userNameHolder}>
            <h3>{user.name}</h3>
          </div>
          <img src={user.avatar} alt="Avatar" style={{ width: "50px" }} />
          <div>
            <FaArrowRight className={s.logout} onClick={logoutUser} />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
