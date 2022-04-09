const Jimp = require("jimp");
const path = require("path");
const UserDto = require("../dtos/user-dto");
const userService = require("../services/user-service");

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;
    const { _id } = req.user;

    if (!name || !avatar) {
      return res.status(400).json({
        message: "name and avatar are required",
      });
    }

    // converting image
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      const jimpResponse = await Jimp.read(buffer);
      jimpResponse
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "couldn't process image",
      });
    }

    try {
      const user = await userService.findUser({
        _id: _id,
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.activated = true;
      await user.save();
      console.log(user);
      res.status(200).json({
        user: new UserDto(user),
        auth: true,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

module.exports = new ActivateController();
