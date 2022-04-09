import React from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextBox from "../../../../components/shared/TextBox/TextBox";
import s from "./StepName.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../../store/slices/activateSlice";

function StepName({ onNext }) {
	const dispatch = useDispatch();
	const { name } = useSelector((state) => state.activate);

	const [state, setState] = React.useState({
		value: name,
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
		dispatch(setName(state.value));
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
				alt="bg"
			/>
			<Card>
				<h2 className={s.textHeader}>
					What should <br />
					we call you?
				</h2>
				<p className={s.textSubheader}>
					Provide your full name so that you friends can
					easily find you.{" "}
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
					Your name will be visible to your friends
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

export default StepName;
