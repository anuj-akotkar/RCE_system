const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeCode = async (language, code) => {
  const tempFilePath = path.join(__dirname, `${Date.now()}.${language === "cpp" ? "cpp" : "py"}`);
  fs.writeFileSync(tempFilePath, code);

  const image = language === "cpp" ? "cpp-runner" : "python-runner";
  const dockerFilePath = language === "cpp" ? "../cpp" : "../python";

  const dockerBuildCmd = `docker build -t ${image} ${dockerFilePath}`;
  const dockerRunCmd = `docker run --rm -v "${tempFilePath}:/app/${path.basename(tempFilePath)}" ${image}`;

  return new Promise((resolve, reject) => {
    exec(dockerBuildCmd, (err, stdout, stderr) => {
      if (err) return reject("Build failed: " + stderr);

      exec(dockerRunCmd, (err2, stdout2, stderr2) => {
        fs.unlinkSync(tempFilePath); // cleanup
        if (err2) return reject("Execution error: " + stderr2);
        resolve(stdout2);
      });
    });
  });
};

module.exports = executeCode;
