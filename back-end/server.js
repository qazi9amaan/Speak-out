require("dotenv").config();
const express = require("express");
const DbConnect = require("./database");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();
DbConnect();

const corsOptions = {
	origin: ["http://localhost:3000"],
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
