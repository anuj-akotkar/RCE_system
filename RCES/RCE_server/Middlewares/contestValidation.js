const mongoose = require('mongoose');

const validateContestData = (req, res, next) => {
    const { title, description, timeLimit, questions } = req.body;
    
    const errors = [];
    
    // Validate contest fields
    if (!title || title.trim().length === 0) {
        errors.push('Contest title is required');
    } else if (title.trim().length > 100) {
        errors.push('Contest title cannot exceed 100 characters');
    }
    
    if (!description || description.trim().length === 0) {
        errors.push('Contest description is required');
    } else if (description.trim().length > 5000) {
        errors.push('Contest description cannot exceed 5000 characters');
    }
    
    if (!timeLimit || timeLimit <= 0) {
        errors.push('Valid time limit is required');
    } else if (timeLimit > 1440) { // 24 hours max
        errors.push('Time limit cannot exceed 24 hours (1440 minutes)');
    }
    
    if (!Array.isArray(questions) || questions.length === 0) {
        errors.push('At least one question is required');
    } else if (questions.length > 50) {
        errors.push('Contest cannot have more than 50 questions');
    }
    
    // Validate each question
    if (Array.isArray(questions)) {
        questions.forEach((question, index) => {
            // Title validation
            if (!question.title) {
                errors.push(`Question ${index + 1}: Title is required`);
            } else if (question.title.trim().length > 200) {
                errors.push(`Question ${index + 1}: Title cannot exceed 200 characters`);
            }
            
            // Function name validation
            if (!question.functionName) {
                errors.push(`Question ${index + 1}: Function name is required`);
            } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(question.functionName)) {
                errors.push(`Question ${index + 1}: Invalid function name. Must start with letter or underscore`);
            }
            
            // Input fields validation
            if (!Array.isArray(question.inputFields) || question.inputFields.length === 0) {
                errors.push(`Question ${index + 1}: Input fields are required`);
            }
            
            // Input types validation
            if (!Array.isArray(question.inputTypes) || question.inputTypes.length !== question.inputFields?.length) {
                errors.push(`Question ${index + 1}: Input types must match input fields`);
            }
            // Output fields validation
           if (!Array.isArray(question.outputFields) || question.outputFields.length === 0) {
               errors.push(`Question ${index + 1}: Output fields are required`);
           }
           
           // Output types validation
           if (!Array.isArray(question.outputTypes) || question.outputTypes.length !== question.outputFields?.length) {
               errors.push(`Question ${index + 1}: Output types must match output fields`);
           }
           
           // Test cases validation
           if (!Array.isArray(question.testCases) || question.testCases.length === 0) {
               errors.push(`Question ${index + 1}: At least one test case is required`);
           } else if (question.testCases.length > 100) {
               errors.push(`Question ${index + 1}: Cannot have more than 100 test cases`);
           } else {
               // Validate each test case
               question.testCases.forEach((tc, tcIndex) => {
                   if (!tc.input && tc.input !== '') {
                       errors.push(`Question ${index + 1}, Test case ${tcIndex + 1}: Input is required`);
                   }
                   if (!tc.expectedOutput && tc.expectedOutput !== '') {
                       errors.push(`Question ${index + 1}, Test case ${tcIndex + 1}: Expected output is required`);
                   }
               });
           }
       });
   }
   
   if (errors.length > 0) {
       return res.status(400).json({
           success: false,
           message: 'Validation failed',
           errors
       });
   }
   
   // Sanitize data
   req.body.title = title.trim();
   req.body.description = description.trim();
   req.body.questions = questions.map(q => ({
       ...q,
       title: q.title.trim(),
       description: q.description.trim(),
       functionName: q.functionName.trim(),
       difficulty: q.difficulty?.toLowerCase() || 'medium'
   }));
   
   next();
};

module.exports = { validateContestData };