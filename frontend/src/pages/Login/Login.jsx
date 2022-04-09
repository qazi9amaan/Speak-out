import React, { useState } from "react";
import Card from "../../components/shared/Card/Card";
import s from "./Login.module.css";
import Button from "../../components/shared/Button/Button";
import TextBox from "../../components/shared/TextBox/TextBox";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../http";

import { useDispatch } from "react-redux";
import { setOtp } from "../../store/slices/authSlice";

function Login() {
	const [componentState, setcomponentState] = useState({
		phoneNumber: "",
		error: "",
		btnActive: false,
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onClickHandler = () => {
		sendOtp({ phone: `+91${componentState.phoneNumber}` })
			.then((res) => {
				console.log(res.data);
				if (res.status === 200) {
					// save to store
					dispatch(
						setOtp({
							phone: res.data.phone,
							hash: res.data.hash,
						})
					);
					navigate("/verify?otp=" + res.data.otp);
				}
			})
			.catch((err) => {
				console.log(err);
				setcomponentState({
					...componentState,
					error: err.message,
				});
			});
	};

	return (
		<div className={s.cardWrapper}>
			<img
				className={s.backgroundCircleArt}
				src="/images/background-circle.svg"
			/>
			<Card>
				<h2 className={s.textHeader}>
					Please provide your phone number
				</h2>
				<p className={s.textSubheader}>
					We’ll text you a 4 digit verfication code.
				</p>
				<div className={s.inputHolder}>
					<div>+91</div>
					<TextBox
						onChange={(e) => {
							setcomponentState({
								...componentState,
								phoneNumber: e.target.value,
							});

							if (e.target.value.length == 10) {
								console.log(e.target.value);
								setcomponentState({
									...componentState,
									btnActive: true,
									phoneNumber: e.target.value,
								});
							}
						}}
						maxLength={10}
						pattern="[0-9]*"
						type={"tel"}
						value={componentState.phoneNumber}
					/>
				</div>
				<p className={s.helpText}>
					By signing up you agree to our Terms & Conditions
					and Privacy Policy.
				</p>
				<Button
					name={"CONTINUE"}
					onClick={onClickHandler}
					disabled={!componentState.btnActive}
				/>
				<p className={s.errorText}>
					{componentState.error}
				</p>
			</Card>
		</div>
	);
}

export default Login;
