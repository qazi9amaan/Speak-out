import React from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextBox from "../../../../components/shared/TextBox/TextBox";
import s from "./StepUsername.module.css";
import { useDispatch } from "react-redux";
import { setUserName } from "../../../../store/slices/activateSlice";

function StepUsername({ onNext }) {
	const dispatch = useDispatch();

	const [state, setState] = React.useState({
		value: "",
		error: null,
		disabled: true,
	});

	const nextStep = () => {
		if (!state.value) {
			setState({
				...state,
				error: "Name is required",
			});
			return;
		}
		setState({
			...state,
			error: null,
			disabled: true,
		});
		dispatch(setUserName(state.value));
		onNext((prev) => prev + 1);
	};

	const onInputChange = (e) => {
		if (e.target.value.length > 0) {
			setState({
				disabled: false,
				error: null,
				value: e.target.value,
			});
		} else {
			setState({
				disabled: true,
				error: null,
				value: e.target.value,
			});
		}
	};

	return (
		<div className={s.cardWrapper}>
			<img
				className={s.backgroundCircleArt}
				src="/images/background-circle.svg"
				alt="background assest"
			/>
			<Card>
				<h2 className={s.textHeader}>
					Let’s make <br />a fancy username
				</h2>
				<p className={s.textSubheader}>
					Make a unqiue username for people to find you.{" "}
				</p>
				<div className={s.inputHolder}>
					<TextBox
						onChange={onInputChange}
						maxLength={30}
						type={"text"}
						value={state.value}
					/>
				</div>
				<p className={s.helpText}>
					You cannot change it later.
				</p>
				<Button
					name={"NEXT"}
					onClick={nextStep}
					disabled={state.disabled}
				/>
				<p className={s.errorText}>{state.error}</p>
			</Card>
		</div>
	);
}

export default StepUsername;
