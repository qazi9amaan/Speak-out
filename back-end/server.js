require("dotenv").config();
const express = require("express");
const DbConnect = require("./database");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
DbConnect();

const corsOptions = {
	credentials: true,
	origin: ["http://localhost:3000"],
	optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use("/storage", express.static("storage"));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
