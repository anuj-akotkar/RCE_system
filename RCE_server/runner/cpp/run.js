const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const CPP_DIR = path.join(__dirname);
const TEMPLATE = path.join(CPP_DIR, 'templates', 'main.cpp');

async function runCpp(userCode, testCases) {
  const results = [];

  const codePath = path.join(CPP_DIR, 'main.cpp');
  fs.writeFileSync(codePath, userCode);

  for (const testCase of testCases) {
    const inputPath = path.join(CPP_DIR, 'input.txt');
    const expected = testCase.expected.trim();

    fs.writeFileSync(inputPath, testCase.input);

    try {
      execSync(`docker run --rm -v "${CPP_DIR}:/app" cpp-runner`);

      //const output = fs.readFileSync(path.join(CPP_DIR, 'output.txt'), 'utf-8').trim();
      const outputPath = path.join(CPP_DIR, 'output.txt');
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
        //passed: output === expected,
        passed: output.replace(/\s+/g, '') === expected.replace(/\s+/g, '')

      });
    } catch (err) {
      results.push({
        input: testCase.input,
        expected,
        output:  err.stderr?.toString() || "Runtime Error or Timeout",
        passed: false,
      });
    }
  }

  return results;
}

module.exports = { runCpp };

