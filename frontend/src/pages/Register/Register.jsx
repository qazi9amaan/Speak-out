import React, { useState } from "react";
import StepName from "./Steps/StepName/StepName";
import StepUsername from "./Steps/StepUsername/StepUsername";
import StepAvatar from "./Steps/StepAvatar/StepAvatar";
const steps = {
	1: StepName,
	2: StepAvatar,
	3: StepUsername,
};

function Register() {
	const [step, setStep] = useState(1);
	const Step = steps[step];

	const onNextStep = () => {
		setStep((prevStep) => prevStep + 1);
	};

	return (
		<div>
			<Step onNext={onNextStep} />
		</div>
	);
}

export default Register;
