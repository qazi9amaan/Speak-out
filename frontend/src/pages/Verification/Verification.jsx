import React, { useEffect, useState } from "react";
import Card from "../../components/shared/Card/Card";
import s from "./Verification.module.css";
import Button from "../../components/shared/Button/Button";
import TextBox from "../../components/shared/TextBox/TextBox";
import { verifyOtp, sendOtp } from "../../http";
import { useSelector, useDispatch } from "react-redux";
import {
	setOtp,
	setAuth,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

let startTime = new Date(new Date().getTime() + 60000);

function Verification() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { phone, hash } = useSelector(
		(state) => state.auth.otp
	);

	const [otp, setOtpCode] = useState({
		0: "",
		1: "",
		2: "",
		3: "",
	});
	const [error, setError] = useState("");

	const calculateTimeLeft = () => {
		let difference = +startTime - +new Date();
		let timeLeft = {};
		if (difference > 0) {
			timeLeft = {
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return timeLeft;
	};
	const [timeLeft, setTimeLeft] = useState(
		calculateTimeLeft()
	);

	useEffect(() => {
		if (!phone && !hash) {
			navigate("/");
		}
		const timer = setTimeout(() => {
			let _timeLeft = calculateTimeLeft();
			setTimeLeft(_timeLeft);
		}, 1000);

		return () => clearTimeout(timer);
	}, [startTime, timeLeft]);

	const focusNextField = (e) => {
		if (e.target.value.length === 1) {
			const nextField = e.target.nextElementSibling;
			if (nextField) {
				nextField.focus();
				nextField.select();
			}
			setOtpCode({
				...otp,
				[e.target.id]: e.target.value,
			});
			setError("");
		}
	};

	const onClickHandler = (e) => {
		e.preventDefault();
		const _otp = Object.values(otp)
			.toString()
			.replaceAll(",", "");

		if (_otp.length === 4) {
			verifyOtp({
				phone: phone,
				otp: _otp,
				hash: hash,
			})
				.then((res) => {
					if (res.status === 200) {
						console.log(res.data);
						dispatch(setAuth(res.data));
						// navigate("/register");
					}
				})
				.catch((err) => {
					setError(err.message);
				});
		} else {
			setError("OTP should be 4 digit");
		}
	};

	const resendOtpClickListener = (e) => {
		e.preventDefault();
		sendOtp({ phone })
			.then((res) => {
				console.log(res.data);
				if (res.status === 200) {
					dispatch(
						setOtp({
							phone: res.data.phone,
							hash: res.data.hash,
						})
					);
					startTime = new Date(
						new Date().getTime() + 60000
					);

					setError("");
				}
			})
			.catch((err) => {
				console.log(err);
				setError(err.message);
			});
	};

	function pad(d) {
		if (d) {
			return d < 10 ? "0" + d.toString() : d.toString();
		}
	}

	return (
		<div className={s.cardWrapper}>
			<img
				className={s.backgroundCircleArt}
				src="/images/background-circle.svg"
			/>
			<Card>
				<h2 className={s.textHeader}>
					We’ve sent you a verification code.
				</h2>
				<p className={s.textSubheader}>
					Please provide the code sent to {phone}
				</p>
				<div className={s.inputHolder}>
					<TextBox
						style={{ textAlign: "center" }}
						onChange={(e) => {
							focusNextField(e);
						}}
						maxLength={1}
						type={"text"}
						pattern={"[0-9]{1}"}
						value={otp[0]}
						id={"0"}
					/>
					<TextBox
						style={{ textAlign: "center" }}
						onChange={(e) => {
							focusNextField(e);
						}}
						maxLength={1}
						type={"text"}
						pattern={"[0-9]{1}"}
						value={otp[1]}
						id={"1"}
					/>
					<TextBox
						style={{ textAlign: "center" }}
						onChange={(e) => {
							focusNextField(e);
						}}
						maxLength={1}
						type={"text"}
						pattern={"[0-9]{1}"}
						value={otp[2]}
						id={"2"}
					/>
					<TextBox
						style={{ textAlign: "center" }}
						onChange={(e) => {
							focusNextField(e);
						}}
						maxLength={1}
						type={"text"}
						pattern={"[0-9]{1}"}
						value={otp[3]}
						id={"3"}
					/>
				</div>
				<p className={s.helpText} style={{ width: "60%" }}>
					Didn’t receive the verification code?{" "}
					<span>
						{timeLeft["seconds"] &&
						timeLeft["seconds"] != 0 ? (
							"00:" + pad(timeLeft["seconds"])
						) : (
							<a href="#" onClick={resendOtpClickListener}>
								{" "}
								Resend
							</a>
						)}
					</span>
				</p>
				<Button name={"VERIFY"} onClick={onClickHandler} />
				<p className={s.errorText}>{error}</p>
			</Card>
		</div>
	);
}

export default Verification;
