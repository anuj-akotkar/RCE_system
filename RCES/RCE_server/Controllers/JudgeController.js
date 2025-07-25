const axios = require('axios');
const Question = require("../Models/Questions");
const Submission = require("../Models/Submission");
const LanguageConfig = require("../Models/Languageconfig");
const Contest = require("../Models/Contest");
const fs = require('fs').promises;
const path = require('path');

// Use http for local Judge0 instance
const JUDGE0_URL = 'http://localhost:2358/submissions/?base64_encoded=false&wait=true';

// Unified runCodeWithJudge0 function
async function runCodeWithJudge0(languageId, sourceCode, stdin) {
    try {
        const response = await axios.post(JUDGE0_URL, {
            language_id: languageId,
            source_code: sourceCode,
            stdin: stdin
        });
        return {
            stdout: response.data.stdout || '',
            stderr: response.data.stderr || '',
            status: response.data.status || {},
            time: response.data.time || '0',
            memory: response.data.memory || '0'
        };
    } catch (error) {
        console.error('Judge0 error:', error);
        throw new Error('Code execution failed');
    }
}

// Run code on sample/public testcases
exports.runSample = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        const question = await Question.findById(questionId).populate({
            path: "testCases",
            match: { isPublic: true }
        });
        const langConfig = await LanguageConfig.findOne({ name: language });
        const results = [];
        for (const testCase of question.testCases) {
            const result = await runCodeWithJudge0(langConfig.judge0Id, code, testCase.input);
            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                output: result.stdout,
                passed: result.stdout.trim() === testCase.expectedOutput.trim(),
            });
        }
        res.status(200).json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Updated submit method with full code integration
exports.submit = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        const userId = req.user.id;

        console.log(`🚀 Submission: Question ${questionId}, Language: ${language}`);

        const question = await Question.findById(questionId).populate("testCases").populate("contest");
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        const langConfig = await LanguageConfig.findOne({ name: language });
        if (!langConfig) {
            return res.status(400).json({ success: false, message: "Language not supported" });
        }

        // Prepare full code using the generated template
        const fullCode = await prepareFullCodeForExecution(question, language, code);
        console.log('📝 Full code prepared for execution');

        const results = [];
        let allPassed = true;
        let totalExecutionTime = 0;
        let maxMemory = 0;

        // Run against all test cases
        for (let i = 0; i < question.testCases.length; i++) {
            const testCase = question.testCases[i];
            console.log(`⚡ Running test case ${i + 1}/${question.testCases.length}`);

            try {
                const result = await runCodeWithJudge0(langConfig.judge0Id, fullCode, testCase.input);
                const passed = result.stdout.trim() === testCase.expectedOutput.trim();
                const executionTime = parseFloat(result.time) || 0;
                const memory = parseInt(result.memory) || 0;

                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: result.stdout,
                    passed,
                    executionTime,
                    memory,
                    status: result.status.description || 'Unknown'
                });

                if (!passed) allPassed = false;
                totalExecutionTime += executionTime;
                maxMemory = Math.max(maxMemory, memory);

                console.log(`${passed ? '✅' : '❌'} Test case ${i + 1}: ${passed ? 'PASSED' : 'FAILED'}`);

            } catch (error) {
                console.error(`❌ Test case ${i + 1} execution error:`, error);
                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    passed: false,
                    executionTime: 0,
                    memory: 0,
                    status: 'Runtime Error',
                    error: error.message
                });
                allPassed = false;
            }
        }

        // Save submission to database
        const submission = await Submission.create({
            user: userId,
            question: questionId,
            code,
            language,
            results,
            passed: allPassed,
            executionTime: totalExecutionTime.toFixed(3),
            memory: maxMemory
        });

        console.log(`🏁 Submission complete: ${allPassed ? 'ACCEPTED' : 'FAILED'}`);

        res.status(200).json({
            success: true,
            submission: {
                id: submission._id,
                status: allPassed ? 'Accepted' : 'Wrong Answer',
                passed: allPassed,
                passedTests: results.filter(r => r.passed).length,
                totalTests: results.length,
                totalExecutionTime: totalExecutionTime.toFixed(3),
                maxMemory,
                results
            }
        });

    } catch (err) {
        console.error('💥 Submission error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Submission failed",
            error: err.message 
        });
    }
};

// Helper function to prepare full code for execution
async function prepareFullCodeForExecution(question, language, userCode) {
    try {
        const contestName = question.contest.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const problemName = question.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const extension = language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'py';
        const fullTemplatePath = path.join(
            process.cwd(),
            'Contests',
            contestName,
            'problems',
            problemName,
            'boilerplate-full',
            `function.${extension}`
        );
        // Read the full template
        const template = await fs.readFile(fullTemplatePath, 'utf8');
        // Replace the placeholder with user code
        const fullCode = template.replace('// USER CODE HERE', userCode.trim());
        console.log('📄 Full code template loaded and user code injected');
        return fullCode;
    } catch (error) {
        console.error('Error preparing full code:', error);
        throw new Error(`Failed to prepare executable code: ${error.message}`);
    }
}

// Get all submissions for a question
exports.getSubmissionsByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const submissions = await Submission.find({ question: questionId });
        res.status(200).json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a single submission by ID
exports.getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        res.status(200).json({ success: true, submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};