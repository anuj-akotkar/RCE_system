const Question = require("../Models/Question");
const Section = require("../Models/Section");

exports.createQuestion = async (req, res) => {
  try {
    const {
      sectionId,
      title,
      description,
      difficulty,
      allowedLanguages,
      publicTestCases,
      hiddenTestCases,
      expectedTimeComplexity,
      expectedSpaceComplexity,
    } = req.body;

    if (
      !sectionId ||
      !title ||
      !description ||
      !difficulty ||
      !allowedLanguages ||
      !publicTestCases ||
      !hiddenTestCases
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const newQuestion = await Question.create({
      title,
      description,
      difficulty,
      allowedLanguages,
      publicTestCases,
      hiddenTestCases,
      expectedTimeComplexity,
      expectedSpaceComplexity,
    });

    await Section.findByIdAndUpdate(
      sectionId,
      { $push: { questions: newQuestion._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Question created and added to section",
      question: newQuestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create question",
      error: err.message,
    });
  }
};
exports.updateQuestion = async (req, res) => {
    try {
      const {
        questionId,
        title,
        description,
        difficulty,
        allowedLanguages,
        publicTestCases,
        hiddenTestCases,
        expectedTimeComplexity,
        expectedSpaceComplexity,
      } = req.body;
  
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
          title,
          description,
          difficulty,
          allowedLanguages,
          publicTestCases,
          hiddenTestCases,
          expectedTimeComplexity,
          expectedSpaceComplexity,
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Question updated successfully",
        question: updatedQuestion,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update question",
        error: err.message,
      });
    }
  };
  exports.deleteQuestion = async (req, res) => {
    try {
      const { questionId, sectionId } = req.body;
  
      await Question.findByIdAndDelete(questionId);
  
      await Section.findByIdAndUpdate(
        sectionId,
        { $pull: { questions: questionId } },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete question",
        error: err.message,
      });
    }
  };
    