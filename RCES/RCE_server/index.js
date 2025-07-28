const express = require("express");
const app = express();

const database = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryconnect } = require("./Config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

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
		origin: "http://localhost:3000",
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
const contactusRoutes = require('./Routes/Contactusroutes');
const contestRoutes = require('./Routes/Contestroutes');
const questionRoutes = require('./Routes/questionroutes');
const profileRoutes = require('./Routes/Profileroutes');
const userRoutes = require('./Routes/Userroutes');
const codeRoutes = require("./Routes/codeRoutes");
const feedbackRoutes = require('./Routes/feedbackroutes');
const contestProgressRoutes = require('./Routes/contestprogressroutes');

// Register routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/contests', contestRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/code', codeRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/progress', contestProgressRoutes);
app.use('/api/v1/contactus', contactusRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});