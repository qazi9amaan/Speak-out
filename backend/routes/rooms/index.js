const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const roomControllers = require("../../controller/rooms-controller");

// room
router.post("/rooms", authMiddleware, roomControllers.create);
router.get("/rooms", authMiddleware, roomControllers.index);
router.get("/rooms/:roomid", authMiddleware, roomControllers.show);

module.exports = router;
