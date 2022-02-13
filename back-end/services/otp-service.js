const crypto = require("crypto");
const hashService = require("./hash-service");

const SMS_SID = process.env.SMS_SID;
const SMS_AUTH_TOKEN = process.env.SMS_AUTH_TOKEN;

const twilio = require("twilio")(SMS_SID, SMS_AUTH_TOKEN, {
	lazyLoading: true,
});

class OtpService {
	async generateOtp() {
		const otp = crypto.randomInt(1000, 9999);
		return otp;
	}

	async sendSms(phone, otp) {
		return await twilio.messages.create({
			body: `Your 4 digit otp for voice house is ${otp}`,
			to: phone,
			from: process.env.SMS_FROM_NUMBER,
		});
	}

	verifyOtp(hashedOtp, data) {
		const computedHash = hashService.hashOtp(data);
		return computedHash === hashedOtp;
	}
}

module.exports = new OtpService();
