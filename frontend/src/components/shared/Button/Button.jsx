import React from "react";
import s from "./Button.module.css";

function Button(props) {
	const { name, onClick, disabled } = props;
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={s.btn}>
			{name}
		</button>
	);
}

export default Button;
