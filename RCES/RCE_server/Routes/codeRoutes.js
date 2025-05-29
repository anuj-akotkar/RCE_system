const express = require("express");
const router = express.Router();
const { run, submit } = require("../Controllers/codeController");
const { auth, isStudent } = require("../Middlewares/auth");

router.post("/run", auth, isStudent, run);
router.post("/submit", auth, isStudent, submit);

module.exports = router;