const express = require("express");
const router = express.Router();
const { contactUsController } = require("../Controllers/Contactus");

// Use POST / (root) for contact form submission
router.post("/", contactUsController);

module.exports = router;