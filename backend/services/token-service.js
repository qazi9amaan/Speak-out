const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId, token) {
    try {
      await refreshModel.create({
        token,
        userId,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  async verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log(e.message);
    }
  }
  async verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
    } catch (e) {
      console.log(e.message);
    }
  }

  async findToken(data) {
    try {
      return await refreshModel.findOne(data);
    } catch (e) {
      console.log(e.message);
    }
  }

  async updateRefreshToken(userId, refreshToken) {
    try {
      return await refreshModel.updateOne(
        { userId: userId },
        { token: refreshToken }
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  async removeToken(refreshToken) {
    try {
      return await refreshModel.deleteOne({ token: refreshToken });
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = new TokenService();
