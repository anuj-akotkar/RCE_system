const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const PYTHON_DIR = path.join(__dirname);

async function runPython(userCode, testCases) {
  const results = [];

  const codePath = path.join(PYTHON_DIR, 'main.py');
  fs.writeFileSync(codePath, userCode);

  for (const testCase of testCases) {
    const inputPath = path.join(PYTHON_DIR, 'input.txt');
    const outputPath = path.join(PYTHON_DIR, 'output.txt');

    fs.writeFileSync(inputPath, testCase.input);

    try {
      execSync(`docker run --rm -v "${PYTHON_DIR}:/app" python-runner`);

      let output = '';
      if (fs.existsSync(outputPath)) {
        output = fs.readFileSync(outputPath, 'utf-8').trim();
      } else {
        output = 'No output generated';
      }

      results.push({
        input: testCase.input,
        expected: testCase.expected.trim(),
        output,
        passed: output.replace(/\s+/g, '') === testCase.expected.trim().replace(/\s+/g, '')
      });

    } catch (err) {
      results.push({
        input: testCase.input,
        expected: testCase.expected.trim(),
        output: err.stderr?.toString() || err.message || "Runtime Error or Timeout",
        passed: false,
      });
    }
  }

  return results;
}

module.exports = { runPython };
