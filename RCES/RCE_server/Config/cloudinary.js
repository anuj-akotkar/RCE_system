const cloudinary = require("cloudinary").v2
require("dotenv").config()
function cloudinaryconnect (){
    try{
        cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
      console.log("Cloudinary connected successfully");
  } catch (error) {
    console.log("Cloudinary connection failed:", error);
  }
}
module.exports = {cloudinaryconnect, cloudinary};