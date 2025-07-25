const validateContestData = (req, res, next) => {
    const { title, description, timeLimit, questions } = req.body;
    
    const errors = [];
    
    if (!title || title.trim().length === 0) {
        errors.push('Contest title is required');
    }
    
    if (!description || description.trim().length === 0) {
        errors.push('Contest description is required');
    }
    
    if (!timeLimit || timeLimit <= 0) {
        errors.push('Valid time limit is required');
    }
    
    if (!Array.isArray(questions) || questions.length === 0) {
        errors.push('At least one question is required');
    }
    
    // Validate each question
    questions.forEach((question, index) => {
        if (!question.title) {
            errors.push(`Question ${index + 1}: Title is required`);
        }
        
        if (!question.functionName) {
            errors.push(`Question ${index + 1}: Function name is required`);
        }
        
        if (!Array.isArray(question.inputFields) || question.inputFields.length === 0) {
            errors.push(`Question ${index + 1}: Input fields are required`);
        }
        
        if (!Array.isArray(question.inputTypes) || question.inputTypes.length !== question.inputFields?.length) {
            errors.push(`Question ${index + 1}: Input types must match input fields`);
        }
        
        if (!Array.isArray(question.outputFields) || question.outputFields.length === 0) {
            errors.push(`Question ${index + 1}: Output fields are required`);
        }
        
        if (!Array.isArray(question.testCases) || question.testCases.length === 0) {
            errors.push(`Question ${index + 1}: At least one test case is required`);
        }
    });
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    next();
};

module.exports = { validateContestData };