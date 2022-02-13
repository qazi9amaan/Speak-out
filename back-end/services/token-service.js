const jwt = require("jsonwebtoken");

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_TOKEN,
			{ expiresIn: "1y" }
		);
		return { accessToken, refreshToken };
	}
}
module.exports = new TokenService();
