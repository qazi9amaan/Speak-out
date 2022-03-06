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

		await tokenService.storeRefreshToken(
			user._id,
			refreshToken
		);

		res.cookie("refreshToken", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
		});

		res.cookie("accessToken", accessToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
		});

		const userdto = new UserDto(user);
		res.json({
			auth: true,
			user: userdto,
		});
	}

	async refresh(req, res) {
		// get refresh token from cookie
		const { refreshToken: prevRefreshToken } = req.cookies;
		if (!prevRefreshToken) {
			res.status(400).json({
				message: "Refresh token is required",
			});
			return;
		}

		// check validity of refresh token
		const user = await tokenService.verifyRefreshToken(
			prevRefreshToken
		);

		if (!user) {
			res.status(401).json({
				message: "Refresh token is invalid",
			});
			return;
		}

		// verfiy whether refresh token is present in db
		try {
			const isRefreshTokenPresent =
				await tokenService.findToken({
					token: prevRefreshToken,
					userId: user._id,
				});

			if (!isRefreshTokenPresent) {
				res.status(500).json({
					message: "internal error",
				});
				return;
			}
		} catch (e) {
			res.status(401).json({
				message: "Refresh token is expired " + e.message,
			});
		}

		//checking user is present in db
		const mUser = await userService.findUser({
			_id: user._id,
		});
		if (!mUser) {
			res.status(500).json({
				message: "internal error",
			});
			return;
		}

		// generate new access token
		const { accessToken, refreshToken } =
			tokenService.generateTokens({
				_id: user._id,
			});

		try {
			// update refresh token in db
			await tokenService.updateRefreshToken(
				user._id,
				refreshToken
			);
		} catch (e) {
			res.status(500).json({
				message: "internal error while updating token",
			});
			return;
		}

		res.cookie("refreshToken", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
		});

		res.cookie("accessToken", accessToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
		});

		const userdto = new UserDto(mUser);
		res.json({
			auth: true,
			user: userdto,
		});
	}
}

module.exports = new AuthController();
