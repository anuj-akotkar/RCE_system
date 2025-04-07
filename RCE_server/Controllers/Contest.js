exports.createContest = async (req, res) => {
    try {
      const { title, description, startTime, endTime } = req.body;
      const instructorId = req.user.id;
  
      const newContest = await Course.create({
        title,
        description,
        startTime,
        endTime,
        instructor: instructorId,
      });
  
      res.status(201).json({ success: true, data: newContest });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.editContest = async (req, res) => {
    try {
      const { contestId } = req.params;
      const updates = req.body;
  
      const updatedContest = await Course.findByIdAndUpdate(contestId, updates, { new: true });
  
      res.status(200).json({ success: true, data: updatedContest });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.getContestDetails = async (req, res) => {
    try {
      const { contestId } = req.params;
  
      const contest = await Course.findById(contestId)
        .populate({
          path: "sections",
          populate: {
            path: "questions",
          },
        })
        .populate("instructor", "name email");
  
      if (!contest) {
        return res.status(404).json({ success: false, message: "Contest not found" });
      }
  
      res.status(200).json({ success: true, data: contest });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.getStudentContest = async (req, res) => {
    try {
      const student = await User.findById(req.user.id).populate("contests");
  
      res.status(200).json({ success: true, data: student.contests });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.getInstructorContest = async (req, res) => {
    try {
      const contests = await Course.find({ instructor: req.user.id });
  
      res.status(200).json({ success: true, data: contests });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.deleteContest = async (req, res) => {
    try {
      const { contestId } = req.params;
  
      const contest = await Course.findById(contestId).populate("sections");
  
      if (!contest) return res.status(404).json({ success: false, message: "Contest not found" });
  
      for (const section of contest.sections) {
        await Section.findByIdAndDelete(section._id);
      }
  
      await Course.findByIdAndDelete(contestId);
  
      res.status(200).json({ success: true, message: "Contest deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  exports.getAllStudentEnrolled = async (req, res) => {
    try {
      const { contestId } = req.params;
      const contest = await Course.findById(contestId).populate("studentsEnrolled", "name email");
  
      if (!contest) {
        return res.status(404).json({ success: false, message: "Contest not found" });
      }
  
      res.status(200).json({ success: true, data: contest.studentsEnrolled });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
              