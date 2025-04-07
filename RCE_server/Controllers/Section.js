const Section = require("../Models/Section");
const Course = require("../Models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, contestId } = req.body;

    if (!sectionName || !contestId) {
      return res.status(400).json({
        success: false,
        message: "Section name and contest ID are required",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
      contestId,
      { $push: { contestContent: newSection._id } },
      { new: true }
    ).populate("contestContent");

    res.status(200).json({
      success: true,
      message: "Section created and added to contest successfully",
      updatedCourse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: err.message,
    });
  }
};
exports.updateSection = async (req, res) => {
    try {
      const { sectionName, sectionId } = req.body;
  
      if (!sectionName || !sectionId) {
        return res.status(400).json({
          success: false,
          message: "Section name and section ID are required",
        });
      }
  
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Section updated successfully",
        updatedSection,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update section",
        error: err.message,
      });
    }
  };
  exports.deleteSection = async (req, res) => {
    try {
      const { sectionId, contestId } = req.body;
  
      await Section.findByIdAndDelete(sectionId);
  
      await Course.findByIdAndUpdate(
        contestId,
        { $pull: { contestContent: sectionId } },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Section deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete section",
        error: err.message,
      });
    }
  };
    