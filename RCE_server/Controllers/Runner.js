const executeCode = require("../runner/utils/executeCode");

exports.runCode = async (req, res) => {
  const { language, code } = req.body;
  try {
    const output = await executeCode(language, code);
    return res.json({ success: true, output });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
};
