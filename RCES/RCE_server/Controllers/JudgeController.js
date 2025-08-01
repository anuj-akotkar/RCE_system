const axios = require('axios');
const Question = require("../Models/Questions");
const Submission = require("../Models/Submission");
const Contest = require("../Models/Contest");
const ContestProgress = require("../Models/Contestprogress");
const fs = require('fs').promises;
const path = require('path');

// Use http for local Judge0 instance
const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

// Hardcoded language configurations (since we're not using DB seeder)
const LANGUAGE_CONFIGS = {
  cpp: {
    judge0Id: 54, // C++ (GCC 9.2.0)
    displayName: "C++",
    defaultTimeLimit: 2,
    defaultMemoryLimit: 256,
    maxCodeSize: 50000,
  },
  java: {
    judge0Id: 62, // Java (OpenJDK 13.0.1)
    displayName: "Java",
    defaultTimeLimit: 3,
    defaultMemoryLimit: 256,
    maxCodeSize: 50000,
  },
  python: {
    judge0Id: 71, // Python (3.8.1)
    displayName: "Python",
    defaultTimeLimit: 5,
    defaultMemoryLimit: 128,
    maxCodeSize: 50000,
  }
};

// Rate limiting configuration (simple in-memory)
const submissionCooldown = new Map(); // userId -> lastSubmissionTime
const SUBMISSION_COOLDOWN_MS = 3000; // 3 seconds between submissions

// Unified runCodeWithJudge0 function with retry logic
async function runCodeWithJudge0(languageId, sourceCode, stdin, timeLimit = 2, memoryLimit = 128000) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.post(
                `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=true`,
                {
                    language_id: languageId,
                    source_code: sourceCode,
                    stdin: stdin,
                    expected_output: null,
                    cpu_time_limit: timeLimit,
                    memory_limit: memoryLimit,
                },
                {
                    timeout: 30000, // 30 second timeout
                }
            );

            return {
                stdout: response.data.stdout || '',
                stderr: response.data.stderr || '',
                status: response.data.status || {},
                time: response.data.time || '0',
                memory: response.data.memory || 0,
                compile_output: response.data.compile_output || '',
                message: response.data.message || '',
            };
        } catch (error) {
            lastError = error;
            console.warn(`Judge0 attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    console.error('All Judge0 attempts failed:', lastError);
    throw new Error('Code execution service temporarily unavailable');
}

// Validate and sanitize code
function validateCode(code, language, maxSize) {
    if (!code || typeof code !== 'string') {
        throw new Error('Code is required');
    }

    if (code.length > maxSize) {
        throw new Error(`Code size exceeds limit of ${maxSize} characters`);
    }

    // Basic security checks
    const dangerousPatterns = {
        cpp: [/__asm|system\s*\(|exec\s*\(|fork\s*\(|#include\s*<\s*windows\.h\s*>/gi],
        java: [/Runtime\.getRuntime|ProcessBuilder|System\.exit/gi],
        python: [/__import__|eval\s*\(|exec\s*\(|compile\s*\(|open\s*\(|file\s*\(/gi],
    };

    const patterns = dangerousPatterns[language] || [];
    for (const pattern of patterns) {
        if (pattern.test(code)) {
            throw new Error('Code contains potentially dangerous operations');
        }
    }

    return code.trim();
}

// Run code on sample/public testcases
exports.runSample = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!questionId || !language || !code) {
            return res.status(400).json({
                success: false,
                message: "Question ID, language, and code are required"
            });
        }

        // Check if language is supported
        const langConfig = LANGUAGE_CONFIGS[language];
        if (!langConfig) {
            return res.status(400).json({
                success: false,
                message: `Language ${language} is not supported`
            });
        }

        // Check rate limiting
        const lastSubmission = submissionCooldown.get(userId);
        if (lastSubmission && Date.now() - lastSubmission < SUBMISSION_COOLDOWN_MS) {
            return res.status(429).json({
                success: false,
                message: "Please wait before running code again"
            });
        }

        // Get question with public test cases
        const question = await Question.findById(questionId).populate({
            path: "testCases",
            match: { isPublic: true }
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        if (!question.testCases || question.testCases.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sample test cases available"
            });
        }

        // Validate code
        const validatedCode = validateCode(code, language, langConfig.maxCodeSize);

        // Prepare full code
        const fullCode = await prepareFullCodeForExecution(question, language, validatedCode);
        
        console.log(`Running sample tests for question ${questionId} in ${language}`);

        const results = [];
        
        for (let i = 0; i < question.testCases.length; i++) {
            const testCase = question.testCases[i];
            
            try {
                const result = await runCodeWithJudge0(
                    langConfig.judge0Id,
                    fullCode,
                    testCase.input,
                    testCase.timeLimitSec || langConfig.defaultTimeLimit,
                    (testCase.memoryLimitMB || langConfig.defaultMemoryLimit) * 1024
                );

                const passed = result.stdout.trim() === testCase.expectedOutput.trim();
                
                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    output: result.stdout,
                    passed,
                    executionTime: parseFloat(result.time) || 0,
                    memory: parseInt(result.memory) || 0,
                    status: result.status.description || 'Unknown',
                    error: result.stderr || result.compile_output || ''
                });
            } catch (error) {
                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    output: '',
                    passed: false,
                    executionTime: 0,
                    memory: 0,
                    status: 'Internal Error',
                    error: error.message
                });
            }
        }

        // Update rate limiting
        submissionCooldown.set(userId, Date.now());

        res.status(200).json({
            success: true,
            results,
            language: langConfig.displayName
        });

    } catch (err) {
        console.error('Run sample error:', err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to run sample tests"
        });
    }
};

// Submit solution for full evaluation
exports.submit = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!questionId || !language || !code) {
            return res.status(400).json({
                success: false,
                message: "Question ID, language, and code are required"
            });
        }

        // Check if language is supported
        const langConfig = LANGUAGE_CONFIGS[language];
        if (!langConfig) {
            return res.status(400).json({
                success: false,
                message: `Language ${language} is not supported`
            });
        }

        // Check rate limiting
        const lastSubmission = submissionCooldown.get(userId);
        if (lastSubmission && Date.now() - lastSubmission < SUBMISSION_COOLDOWN_MS * 2) {
            return res.status(429).json({
                success: false,
                message: "Please wait before submitting again"
            });
        }

        console.log(`Submission: User ${userId}, Question ${questionId}, Language: ${language}`);

        // Get question with all test cases
        const question = await Question.findById(questionId)
            .populate("testCases")
            .populate("contest");
            
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        if (!question.testCases || question.testCases.length === 0) {
            return res.status(500).json({
                success: false,
                message: "No test cases configured for this question"
            });
        }

        // Validate code
        const validatedCode = validateCode(code, language, langConfig.maxCodeSize);

        // Check if user has too many recent failed submissions (anti-brute force)
        const recentSubmissions = await Submission.countDocuments({
            user: userId,
            question: questionId,
            createdAt: { $gte: new Date(Date.now() - 3600000) }, // Last hour
            passed: false
        });

        if (recentSubmissions > 20) {
            return res.status(429).json({
                success: false,
                message: "Too many failed attempts. Please try again later."
            });
        }

        // Prepare full code using the generated template
        const fullCode = await prepareFullCodeForExecution(question, language, validatedCode);
        
        console.log('Full code prepared for execution');

        const results = [];
        let allPassed = true;
        let totalExecutionTime = 0;
        let maxMemory = 0;
        let status = 'Accepted';

        // Run against all test cases
        for (let i = 0; i < question.testCases.length; i++) {
            const testCase = question.testCases[i];
            console.log(`Running test case ${i + 1}/${question.testCases.length}`);

            try {
                const result = await runCodeWithJudge0(
                    langConfig.judge0Id,
                    fullCode,
                    testCase.input,
                    testCase.timeLimitSec || langConfig.defaultTimeLimit,
                    (testCase.memoryLimitMB || langConfig.defaultMemoryLimit) * 1024
                );

                const passed = result.stdout.trim() === testCase.expectedOutput.trim();
                const executionTime = parseFloat(result.time) || 0;
                const memory = parseInt(result.memory) || 0;

                // Check for various error conditions
                let testStatus = 'Accepted';
                if (!passed) {
                    testStatus = 'Wrong Answer';
                    if (status === 'Accepted') status = 'Wrong Answer';
                }
                
                // Judge0 status codes
                if (result.status.id === 3) {
                    testStatus = 'Accepted';
                } else if (result.status.id === 5) {
                    testStatus = 'Time Limit Exceeded';
                    status = 'Time Limit Exceeded';
                } else if (result.status.id === 6) {
                    testStatus = 'Compilation Error';
                    status = 'Compilation Error';
                } else if ([7, 8, 9, 10, 11, 12].includes(result.status.id)) {
                    testStatus = 'Runtime Error';
                    if (status === 'Accepted' || status === 'Wrong Answer') {
                        status = 'Runtime Error';
                    }
                }

                results.push({
                    testCase: i + 1,
                    input: testCase.isPublic ? testCase.input : '[Hidden]',
                    expectedOutput: testCase.isPublic ? testCase.expectedOutput : '[Hidden]',
                    actualOutput: testCase.isPublic ? result.stdout : '[Hidden]',
                    passed,
                    executionTime,
                    memory,
                    status: testStatus,
                    error: testCase.isPublic ? (result.stderr || result.compile_output || '') : ''
                });

                if (!passed) allPassed = false;
                totalExecutionTime += executionTime;
                maxMemory = Math.max(maxMemory, memory);

                console.log(`Test case ${i + 1}: ${passed ? 'PASSED' : 'FAILED'}`);

            } catch (error) {
                console.error(`Test case ${i + 1} execution error:`, error);
                
                results.push({
                    testCase: i + 1,
                    input: testCase.isPublic ? testCase.input : '[Hidden]',
                    expectedOutput: testCase.isPublic ? testCase.expectedOutput : '[Hidden]',
                    actualOutput: '',
                    passed: false,
                    executionTime: 0,
                    memory: 0,
                    status: 'Internal Error',
                    error: 'Execution failed'
                });
                
                allPassed = false;
                if (status === 'Accepted') status = 'Internal Error';
            }
        }

        // Create submission record
        const submission = await Submission.create({
            user: userId,
            question: questionId,
            contest: question.contest?._id,
            code: validatedCode,
            language,
            results,
            passed: allPassed,
            executionTime: totalExecutionTime.toFixed(3),
            memory: maxMemory,
            status,
            score: allPassed ? 100 : Math.round((results.filter(r => r.passed).length / results.length) * 100),
            submissionType: question.contest ? 'contest' : 'practice',
        });

        // Update contest progress if this is a contest submission
        if (question.contest && allPassed) {
            await ContestProgress.findOneAndUpdate(
                { student: userId, contest: question.contest._id },
                { 
                    $addToSet: { completedQuestions: questionId },
                    $inc: { score: 100 } // You can adjust scoring logic
                },
                { upsert: true, new: true }
            );
        }

        // Update rate limiting
        submissionCooldown.set(userId, Date.now());

        console.log(`Submission complete: ${allPassed ? 'ACCEPTED' : status}`);

        // Send response
        res.status(200).json({
            success: true,
            submission: {
                id: submission._id,
                status,
                passed: allPassed,
                passedTests: results.filter(r => r.passed).length,
                totalTests: results.length,
                totalExecutionTime: totalExecutionTime.toFixed(3),
                maxMemory,
                score: submission.score,
                results: results.map(r => ({
                    ...r,
                    // Hide details of hidden test cases
                    input: r.input === '[Hidden]' ? undefined : r.input,
                    expectedOutput: r.expectedOutput === '[Hidden]' ? undefined : r.expectedOutput,
                    actualOutput: r.actualOutput === '[Hidden]' ? undefined : r.actualOutput,
                }))
            }
        });

    } catch (err) {
        console.error('Submission error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Submission failed",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Helper function to prepare full code for execution
async function prepareFullCodeForExecution(question, language, userCode) {
    try {
        const contestName = question.contest?.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'practice';
        const problemName = question.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const extension = language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'py';
        
        // Use path.join for cross-platform compatibility
        const fullTemplatePath = path.join(
            process.cwd(),
            'Contests',
            contestName,
            'problems',
            problemName,
            'boilerplate-full',
            `function.${extension}`
        );

        console.log(`Reading template from: ${fullTemplatePath}`);

        // Check if file exists
        try {
            await fs.access(fullTemplatePath);
        } catch (error) {
            console.error(`Template file not found: ${fullTemplatePath}`);
            throw new Error(`Template not found for ${language}. Please contact support.`);
        }

        // Read the full template
        const template = await fs.readFile(fullTemplatePath, 'utf8');
        
        // Replace the placeholder with user code
        const placeholder = '// USER CODE HERE';
        if (!template.includes(placeholder)) {
            throw new Error('Invalid template format');
        }

        const fullCode = template.replace(placeholder, userCode.trim());
        
        console.log('Full code template loaded and user code injected');
        
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
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "Question ID is required"
            });
        }

        // Only show user's own submissions (unless admin)
        const query = { question: questionId };
        if (req.user.role !== 'Admin') {
            query.user = userId;
        }

        const submissions = await Submission.find(query)
            .select('-code -results.input -results.expectedOutput -results.actualOutput')
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Submission.countDocuments(query);

        res.status(200).json({
            success: true,
            submissions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });

    } catch (err) {
        console.error('Get submissions error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions"
        });
    }
};

// Get a single submission by ID
exports.getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const userId = req.user.id;

        if (!submissionId) {
            return res.status(400).json({
                success: false,
                message: "Submission ID is required"
            });
        }

        const submission = await Submission.findById(submissionId)
            .populate('question', 'title description')
            .populate('user', 'firstName lastName email');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        // Check if user owns this submission (unless admin)
        if (req.user.role !== 'Admin' && submission.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this submission"
            });
        }

        res.status(200).json({
            success: true,
            submission
        });

    } catch (err) {
        console.error('Get submission error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submission"
        });
    }
};