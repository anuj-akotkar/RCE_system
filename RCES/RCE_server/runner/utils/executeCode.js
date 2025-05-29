const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { v4: uuid } = require("uuid");

// Set language image + extension mapping
const config = {
  cpp: {
    image: "cpp-runner",
    extension: "cpp",
    folder: "../cpp",
    compileCmd: "g++ main.cpp -o main",
    runCmd: "./main < input.txt > output.txt",
  },
  python: {
    image: "python-runner",
    extension: "py",
    folder: "../python",
    runCmd: "python3 main.py < input.txt > output.txt",
  },
  java: {
    image: "java-runner",
    extension: "java",
    folder: "../java",
    compileCmd: "javac Main.java",
    runCmd: "java -cp . Main < input.txt > output.txt",
  },
};

const executeCode = async (language, code, testCases = []) => {
  const tempId = uuid();
  const tempDir = path.join(__dirname, `temp-${tempId}`);
  fs.mkdirSync(tempDir);

  const langConfig = config[language];
  if (!langConfig) throw new Error("Unsupported language");

  const codeFile = language === "java" ? "Main.java" : `main.${langConfig.extension}`;
  const codeFilePath = path.join(tempDir, codeFile);
  fs.writeFileSync(codeFilePath, code);

  const inputFilePath = path.join(tempDir, "input.txt");
  const outputFilePath = path.join(tempDir, "output.txt");

  // Build Docker Image (if not built already)
  try {
    execSync(`docker image inspect ${langConfig.image} > /dev/null 2>&1 || docker build -t ${langConfig.image} ${path.join(__dirname, langConfig.folder)}`);
  } catch (err) {
    fs.rmSync(tempDir, { recursive: true });
    throw new Error("Docker build failed: " + err.message);
  }

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const { input, expectedOutput } = testCases[i];

    fs.writeFileSync(inputFilePath, input || "");

    const dockerRunCmd = `docker run --rm -m 100m -v ${tempDir}:/app ${langConfig.image} sh -c "${langConfig.compileCmd ? `${langConfig.compileCmd} && ` : ""}${langConfig.runCmd}"`;

    try {
      execSync(dockerRunCmd, { timeout: 3000 }); // limit per test
      const actualOutput = fs.existsSync(outputFilePath) ? fs.readFileSync(outputFilePath, "utf-8").trim() : "";

      results.push({
        testCase: i + 1,
        input,
        expectedOutput,
        actualOutput,
        verdict: actualOutput === expectedOutput.trim() ? "AC" : "WA",
      });
    } catch (err) {
      results.push({
        testCase: i + 1,
        input,
        expectedOutput,
        actualOutput: "",
        verdict: err.message.includes("timeout") ? "TLE" : "RTE",
        error: err.message,
      });
    }
  }

  fs.rmSync(tempDir, { recursive: true });
  return results;
};

module.exports = executeCode;
