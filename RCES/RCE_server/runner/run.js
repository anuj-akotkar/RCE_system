const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Supported languages and their respective extensions
const languageMap = {
    'javascript': 'js',
    'python': 'py',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp'
};

const runCode = (language, userCode, testCases) => {
    return new Promise((resolve, reject) => {
        // Create a temporary file for the user code
        const ext = languageMap[language];
        if (!ext) {
            return reject(new Error("Unsupported language"));
        }

        const filePath = path.join(__dirname, `temp_code.${ext}`);
        fs.writeFileSync(filePath, userCode);

        // Command based on language
        let command;
        let args = [];

        switch (language) {
            case 'javascript':
                command = 'node';
                args = [filePath];
                break;
            case 'python':
                command = 'python';
                args = [filePath];
                break;
            case 'java':
                command = 'javac';
                args = [filePath];
                break;
            case 'c':
            case 'cpp':
                command = language === 'c' ? 'gcc' : 'g++';
                args = [filePath, '-o', 'temp_code.out'];
                break;
            default:
                return reject(new Error("Unsupported language"));
        }

        // Execute code compilation or interpretation
        const process = spawn(command, args);

        let output = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Error: ${errorOutput || 'Compilation/Execution failed'}`));
            }

            // If compilation was successful and we need to run the program
            if (language === 'java' || language === 'c' || language === 'cpp') {
                // Run the compiled code (if applicable)
                const execCommand = language === 'java' ? 'java' : './temp_code.out';
                const execProcess = spawn(execCommand);

                let finalOutput = '';
                execProcess.stdout.on('data', (data) => {
                    finalOutput += data.toString();
                });

                execProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                execProcess.on('close', () => {
                    // Run test cases
                    const results = testCases.map((testCase, index) => {
                        const expectedOutput = testCase.expected;
                        const actualOutput = finalOutput.trim();

                        return {
                            testCase: index + 1,
                            passed: actualOutput === expectedOutput,
                            output: actualOutput
                        };
                    });

                    resolve(results);
                });
            } else {
                // For interpreted languages, directly compare test cases
                const results = testCases.map((testCase, index) => {
                    const expectedOutput = testCase.expected;
                    const actualOutput = output.trim();

                    return {
                        testCase: index + 1,
                        passed: actualOutput === expectedOutput,
                        output: actualOutput
                    };
                });

                resolve(results);
            }
        });
    });
};

module.exports = runCode;
