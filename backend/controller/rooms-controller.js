const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class RoomsController {
  async create(req, res) {
    const { topic, type } = req.body;

    if (!topic || !type) {
      return res.status(400).json({
        status: 400,
        message: "Please provide topic and type",
      });
    }

    const room = await roomService.create({
      topic,
      roomType: type,
      ownerId: req.user._id,
    });
    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const rooms = await roomService.getAllRooms(["public"]);
    return res.json(rooms.map((room) => new RoomDto(room)));
  }

  async show(req, res) {
    const { roomid } = req.params;
    const room = await roomService.getRoom(roomid);
    return res.json(room);
  }
}

module.exports = new RoomsController();
