const express = require("express");
const app = express();

const database = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryconnect } = require("./Config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryconnect();

// Setting up routes
const contactusroutesRoutes = require('./Routes/Contactusroutes');
const contestRoutes = require('./Routes/Contestroutes');
const questionRoutes = require('./Routes/questionRoutes');
const profileRoutes = require('./Routes/Profileroutes');
const userRoutes = require('./Routes/Userroutes');
const submissionRoutes = require('./Routes/submissionroutes');
const codeRoutes = require("./Routes/codeRoutes");

// Register routes
app.use('/api/v1/code', codeRoutes);
app.use('/api/v1/contests', contestRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/contactus', contactusroutesRoutes);
//app.use("/api/v1/code", codeRoutes);
// ...existing code...

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

