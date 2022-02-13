const UserDto = require("../dtos/user-dto");
const hashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

class AuthController {
	async sendOtp(req, res) {
		const { phone } = req.body;
		if (!phone) {
			res.status(400).json({
				message: "Phone number is required",
			});
			return;
		}

		const otp = await otpService.generateOtp();

		const ttl = 1000 * 60 * 2; // 2 minutes
		const expires = Date.now() + ttl;

		const data = `${phone}.${otp}.${expires}`;
		const hash = hashService.hashOtp(data);

		try {
			// await otpService.sendSms(phone, otp);
			res.json({
				hash: `${hash}.${expires}`,
				phone,
				otp,
			});
		} catch (err) {
			res.status(500).json({
				message: "Error sending sms",
				err: err.message,
			});
		}
	}

	async verifyOtp(req, res) {
		const { phone, hash, otp } = req.body;
		if (!otp || !hash || !phone) {
			res.status(400).json({
				message: "Missing parameters",
			});
			return;
		}

		const [hashedOtp, expires] = hash.split(".");
		if (Date.now() > +expires) {
			res.status(400).json({
				message: "Otp has expired",
			});
			return;
		}

		const data = `${phone}.${otp}.${expires}`;
		const isValid = await otpService.verifyOtp(
			hashedOtp,
			data
		);

		if (!isValid) {
			res.status(400).json({
				message: "Otp is invalid",
			});
			return;
		}

		let user;

		try {
			user = await userService.findUser({ phone });
			if (!user) {
				user = await userService.createUser({ phone });
			}
		} catch (e) {
			res.status(500).json({
				message: "Error finding/creating user",
				err: e.message,
			});
		}

		const { accessToken, refreshToken } =
			tokenService.generateTokens({
				_id: user._id,
				activated: false,
			});

		res.cookie("refreshToken", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
		});

		const userdto = new UserDto(user);
		res.json({
			accessToken,
			user: userdto,
		});
	}
}

module.exports = new AuthController();
