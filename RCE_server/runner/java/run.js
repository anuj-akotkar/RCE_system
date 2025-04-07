const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const JAVA_DIR = path.join(__dirname);

async function runJava(userCode, testCases) {
  const results = [];

  const codePath = path.join(JAVA_DIR, 'Main.java');
  fs.writeFileSync(codePath, userCode);

  for (const testCase of testCases) {
    const inputPath = path.join(JAVA_DIR, 'input.txt');
    const expected = testCase.expected.trim();

    fs.writeFileSync(inputPath, testCase.input);

    try {
      execSync(`docker run --rm -v "${JAVA_DIR}:/app" java-runner`);

      const outputPath = path.join(JAVA_DIR, 'output.txt');
      let output = '';
      if (fs.existsSync(outputPath)) {
        output = fs.readFileSync(outputPath, 'utf-8').trim();
      } else {
        output = 'No output generated';
      }

      results.push({
        input: testCase.input,
        expected,
        output,
        passed: output.replace(/\s+/g, '') === expected.replace(/\s+/g, '')
      });
    } catch (err) {
      results.push({
        input: testCase.input,
        expected,
        output: 'Runtime Error or Timeout',
        passed: false
      });
    }
  }

  return results;
}

module.exports = { runJava };
