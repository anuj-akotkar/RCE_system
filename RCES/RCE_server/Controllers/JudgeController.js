const axios = require('axios');
const Question = require("../Models/Questions");
const Submission = require("../Models/Submission");
const LanguageConfig = require("../Models/Languageconfig");
const Contest = require("../Models/Contest");
const fs = require('fs').promises;
const path = require('path');

// Define the Judge0 URL at the top level of the module
const JUDGE0_URL = 'http://localhost:2358/submissions';
// Static map for supported languages and their Judge0 IDs
const languageMap = {
  cpp: { judge0Id: 54 },    // C++ (GCC 7.4.0)
  python: { judge0Id: 71 }, // Python (3.8.1)
  java: { judge0Id: 62 }     // Java (OpenJDK 13.0.1)
};

// Unified function to interact with Judge0 API
async function runCodeWithJudge0(languageId, sourceCode, stdin) {
    try {
        const response = await axios.post(`${JUDGE0_URL}?base64_encoded=false&wait=true`, {
            language_id: languageId,
            source_code: sourceCode,
            stdin: stdin
        });
        
        return {
            stdout: response.data.stdout || '',
            stderr: response.data.stderr || '',
            status: response.data.status || {},
            time: response.data.time || '0',
            memory: response.data.memory || 0
        };
    } catch (error) {
        if (error.response) {
            console.error('Judge0 API Error Response:', error.response.data);
        } else if (error.request) {
            console.error('Judge0 API No Response:', error.request);
        } else {
            console.error('Judge0 API Setup Error:', error.message);
        }
        throw new Error('Code execution failed');
    }
}

// Function to prepare the full code by injecting user code into a template
async function prepareFullCodeForExecution(questionId, userCode) {
    try {
        const question = await Question.findById(questionId).populate('contest');
        
        if (!question || !question.contest) {
            throw new Error('Question or its associated contest could not be found.');
        }

        const contestName = question.contest.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const problemName = question.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        const snippetPath = path.join(
            __dirname,
            '..',
            '..',
            'Contests',
            contestName,
            'problems',
            problemName,
            'boilerplate',
            `function.cpp`
        );

        const fullTemplatePath = path.join(
            __dirname,
            '..',
            '..',
            'Contests',
            contestName,
            'problems',
            problemName,
            'boilerplate-full',
            `function.cpp`
        );
        
        const template = await fs.readFile(fullTemplatePath, 'utf8');
        const snippetToReplace = await fs.readFile(snippetPath, 'utf8');

        const fullCode = template.replace(snippetToReplace, userCode.trim());
        
        return fullCode;

    } catch (error) {
        console.error('Error preparing full code:', error);
        throw new Error(`Failed to prepare executable code: ${error.message}`);
    }
}

// Controller to run code on sample/public testcases
exports.runSample = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        console.log("from runSample questionid",questionId);
        console.log("from runSample language",language);
        console.log("from runSample code",code);
        const question = await Question.findById(questionId).populate({
            path: "testCases",
            match: { isPublic: true } // ✅ Fetches ONLY public test cases
        });
        console.log(question);
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        // Look up the language details from our static map
        const langDetails = languageMap[language];
        if (!langDetails) {
            return res.status(400).json({ success: false, message: "Language not supported" });
        }

        const fullCode = await prepareFullCodeForExecution(questionId, code);

        const results = [];
        for (const testCase of question.testCases) {
            const result = await runCodeWithJudge0(langDetails.judge0Id, fullCode, testCase.input);
            results.push({
                testCaseId: testCase._id,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.stdout.trim(),
                status: result.status.description,
                stderr: result.stderr
            });
        }

        res.status(200).json({ success: true, results });

    } catch (err) {
        console.error('Error in runSample:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};


// Controller to submit code for evaluation (all testcases)
exports.submit = async (req, res) => {
    try {
        const { questionId, language, code } = req.body;
        const studentId = req.user.id;

        // ✅ Fetches ALL test cases (public and private)
        const question = await Question.findById(questionId).populate({
            path: "testCases",
            match: { isPublic: false } // ✅ Fetches ONLY private test cases
        });
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        // Look up the language details from our static map
        const langDetails = languageMap[language];
        if (!langDetails) {
            return res.status(400).json({ success: false, message: "Language not supported" });
        }

        const fullCode = await prepareFullCodeForExecution(questionId, code);

        let passedCount = 0;
        const totalCount = question.testCases.length;

        for (const testCase of question.testCases) {
            const result = await runCodeWithJudge0(langDetails.judge0Id, fullCode, testCase.input);
            // Judge0 status ID 3 means "Accepted"
            if (result.status.id === 3 && result.stdout.trim() === testCase.expectedOutput.trim()) {
                passedCount++;
            }
        }

        // ✅ Determine final status based on your idea
        let finalStatus = "Failed";
        let submissionStatus = "Failed";
        if (passedCount === totalCount) {
            finalStatus = "All test cases passed!";
            submissionStatus = "Success";
        } else if (passedCount > 0) {
            finalStatus = `Partially passed (${passedCount}/${totalCount})`;
            submissionStatus = "Failed"; // Still failed overall
        } else {
             finalStatus = `Failed (${passedCount}/${totalCount})`;
        }

        // Save the submission record to the database
        const submission = await Submission.create({
            student: studentId,
            question: questionId,
            language: language,
            code: code,
            passedTestCases: passedCount,
            totalTestCases: totalCount,
            status: submissionStatus,
        });

        // ✅ Return a clear, user-friendly response
        res.status(200).json({ 
            success: true, 
            status: finalStatus,
            passedTestCases: passedCount,
            totalTestCases: totalCount,
            submissionId: submission._id
        });

    } catch (err) {
        console.error('Error in submit:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};


// Get all submissions for a question by the logged-in user
exports.getSubmissionsByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const studentId = req.user.id;
        const submissions = await Submission.find({ question: questionId, student: studentId }).sort({ createdAt: -1 });
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
